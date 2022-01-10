/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

import { ANY, CtorValue } from 'amos-utils';
import { Box, MutationFactory } from './box';
import { selector, SelectorFactory } from './selector';

export type ShapedBox<S, KM extends string, KS extends string> = Box<S> & {
  [P in keyof S & KM]: S[P] extends (...args: infer A) => S ? MutationFactory<A, S> : never;
} & {
  [P in keyof S & KS]: S[P] extends (...args: infer A) => infer R ? SelectorFactory<A, R> : never;
};

export interface BoxFactory<KM extends string, KS extends string> {
  <S>(key: string, initialState: S): ShapedBox<S, KM, KS>;

  extends<NPS, NKM extends keyof NPS & string, NKS extends keyof NPS & string>(
    inferProto: CtorValue<NPS, any[]>,
    options: BoxFactoryOptions<NKM, NKS>,
  ): BoxFactory<KM | NKM, KS | NKS>;
}

export interface BoxFactoryOptions<KM extends string, KS extends string> {
  mutations: Record<KM, boolean>;
  selectors: Record<KS, boolean>;
  name?: string;
}

export function createBoxFactory<PS, KM extends keyof PS & string, KS extends keyof PS & string>(
  inferProto: CtorValue<PS, any[]>,
  options: BoxFactoryOptions<KM, KS>,
): BoxFactory<KM, KS> {
  const { mutations, selectors } = options;

  class EnhancedBox extends Box {}

  if (options.name) {
    Object.defineProperty(EnhancedBox, 'name', { value: options.name });
  }

  function createBox<S>(key: string, initialState: S): ShapedBox<S, KM, KS> {
    const box = new Box(key, initialState);
    for (const km in mutations) {
      if (mutations.hasOwnProperty(km)) {
        Object.defineProperty(box, km, {
          value: box.mutation((state: any, ...args) => state[km](...args), `${key}.${km}`),
        });
      }
    }
    for (const ks in selectors) {
      if (selectors.hasOwnProperty(ks)) {
        Object.defineProperty(box, ks, {
          value: selector((select: any, ...args) => select(box)[ks](...args), { type: ks }),
        });
      }
    }
    return box as any;
  }

  createBox.extends = <NPS, NKM extends keyof NPS & string, NKS extends keyof NPS & string>(
    nextProto: CtorValue<NPS, any[]>,
    options: BoxFactoryOptions<NKM, NKS>,
  ): BoxFactory<KM | NKM, KS | NKS> => {
    return createBoxFactory<NPS & PS, KM | NKM, KS | NKS>(ANY, {
      mutations: { ...mutations, ...options.mutations },
      selectors: { ...selectors, ...options.selectors },
    });
  };

  return createBox as any;
}
