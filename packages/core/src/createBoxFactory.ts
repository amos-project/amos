/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

import { resolveCallerName } from 'amos-utils';
import { Box, implementation, Mutation, MutationFactory } from './box';
import { Selector, SelectorFactory } from './selector';

export type BoxWithStateMethods<
  S,
  KM extends keyof S,
  KS extends keyof S,
  SB extends Box = Box<S>,
> = SB & {
  [P in keyof S & KM]: S[P] extends (...args: infer A) => S ? MutationFactory<A, S> : never;
} & {
  [P in keyof S & KS]: S[P] extends (...args: infer A) => infer R ? SelectorFactory<A, R> : never;
};

export interface BoxFactory<B extends Box> {
  new <S, SB extends Box<S>>(key: string, initialState: S): SB;

  extends<NB extends Box>(options: BoxFactoryOptions<NB, B>): BoxFactory<NB>;
}

export interface BoxFactoryOptions<B extends Box, SB extends Box = Box> {
  mutations: {
    [P in keyof B as B[P] extends (...args: any[]) => Mutation
      ? P extends keyof SB
        ? never
        : P
      : never]: null;
  };
  selectors: {
    [P in keyof B as B[P] extends (...args: any[]) => Selector
      ? P extends keyof SB
        ? never
        : P
      : never]: null;
  };
  name?: string;
}

export function createBoxFactory<B extends Box, SB extends Box = Box>(
  options: BoxFactoryOptions<B, SB>,
): BoxFactory<B> {
  class EnhancedBox extends Box {
    static extends<NB extends Box>(nextOptions: BoxFactoryOptions<NB, B>): BoxFactory<NB> {
      Object.assign(nextOptions.mutations, options.mutations);
      Object.assign(nextOptions.selectors, options.selectors);
      nextOptions.name = resolveCallerName();
      return createBoxFactory(nextOptions);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    options.name ??= resolveCallerName();
    Object.defineProperty(EnhancedBox, 'name', { value: options.name || '' });
  }

  implementation<EnhancedBox>(EnhancedBox, options.mutations, options.selectors);

  return EnhancedBox as any;
}
