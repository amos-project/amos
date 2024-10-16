/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, BoxState, implementation, Mutation, MutationFactory } from './box';
import { Selector, SelectorFactory } from './selector';

// hijack for TS2312: An interface can only extend an object type or intersection of object types
// with statically known members.
export interface ShapedBoxMeta<KM, KS> {
  shapeMeta: {
    selectors: KS;
    mutations: KM;
  };
}

export type ShapedBox<
  TShape,
  TMutationKeys extends keyof TShape,
  TSelectorKeys extends keyof TShape,
  TBox extends Box = Box<TShape>,
  KLimiter = TShape /* tricky for WebStorm go to definitions to shape method, if TypeScript allows P in keyof S & KM, this should be removed */,
> = TBox & {
  [P in keyof KLimiter & TMutationKeys]: TShape[P] extends (...args: infer A) => TShape
    ? MutationFactory<A, TShape>
    : never;
} & {
  [P in keyof KLimiter & TSelectorKeys]: TShape[P] extends (...args: infer A) => infer R
    ? SelectorFactory<A, R>
    : never;
};

export interface BoxFactoryStatic<B extends Box> {
  extends<NB extends Box>(options: BoxFactoryOptions<NB, B>): BoxFactory<NB>;
}

export interface BoxFactory<B extends Box> extends BoxFactoryStatic<B> {
  new (key: string, initialState: BoxState<B>): B;
}

export interface BoxFactoryWithDefaultInitialState<B extends Box> extends BoxFactoryStatic<B> {
  new (key: string, initialState?: BoxState<B>): B;
}

export interface BoxFactoryOptions<B extends Box, SB extends Box = Box> {
  name: string;
  mutations: {
    [P in keyof B as B[P] extends (...args: any[]) => Mutation
      ? P extends keyof SB
        ? never
        : P
      : never]: B[P] extends (...args: infer A) => Mutation
      ? null | ((state: BoxState<B>, ...args: A) => BoxState<B>)
      : never;
  };
  selectors: {
    [P in keyof B as B[P] extends (...args: any[]) => Selector
      ? P extends keyof SB
        ? never
        : P
      : never]: B[P] extends (...args: infer A) => Selector<infer A, infer O>
      ? null | ((state: BoxState<B>, ...args: A) => O)
      : never;
  };
  methods?: Partial<B>;
}

export interface BoxFactoryWithDefaultInitialStateOptions<B extends Box, SB extends Box = Box>
  extends BoxFactoryOptions<B, SB> {
  defaultInitialState: BoxState<B>;
}

export function createBoxFactory<B extends Box, SB extends Box = Box>(
  options: BoxFactoryOptions<B, SB>,
): BoxFactory<B>;
export function createBoxFactory<B extends Box, SB extends Box = Box>(
  options: BoxFactoryWithDefaultInitialStateOptions<B, SB>,
): BoxFactoryWithDefaultInitialState<B>;
export function createBoxFactory<B extends Box, SB extends Box = Box>(
  options: BoxFactoryOptions<B, SB>,
): BoxFactory<B> {
  class EnhancedBox extends Box {
    constructor(
      key: string,
      initialState = (options as BoxFactoryWithDefaultInitialStateOptions<B, SB>)
        .defaultInitialState,
    ) {
      super(key, initialState);
    }

    static extends<NB extends Box>(nextOptions: BoxFactoryOptions<NB, B>): BoxFactory<NB> {
      Object.assign(nextOptions.mutations, options.mutations);
      Object.assign(nextOptions.selectors, options.selectors);
      nextOptions.methods = Object.assign(nextOptions.methods || {}, options.methods) as any;
      return createBoxFactory(nextOptions);
    }
  }

  Object.defineProperty(EnhancedBox, 'name', { value: options.name });

  implementation<EnhancedBox>(EnhancedBox, options.mutations, options.selectors, options.methods);

  return EnhancedBox as any;
}
