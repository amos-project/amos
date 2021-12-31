/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, BoxOptions, MutationFactory } from './box';
import { selector, SelectorFactory, SelectorOptions } from './selector';

export type BoxWithStateMethods<S, KM extends keyof S, KS extends keyof S> = Box<S> & {
  [P in keyof S & (KM | KS)]: P extends KM
    ? S[P] extends (...args: infer A) => S
      ? MutationFactory<A, S>
      : never
    : P extends KS
    ? S[P] extends (...args: infer A) => infer R
      ? SelectorFactory<A, R>
      : never
    : never;
};

export interface BoxFactory<
  PS,
  KM extends keyof PS,
  KS extends keyof PS,
  RP extends Record<string, (...args: any[]) => any>,
> {
  <S>(key: string, initialState: S, options?: BoxOptions<S>): BoxWithStateMethods<
    S,
    KM & keyof S,
    KS & keyof S
  > &
    RP;

  extend<
    NPS,
    NRM extends { [P in keyof NPS]?: NPS[P] extends (...args: infer A) => infer R ? {} : never },
    NRS extends {
      [P in keyof NPS]?: NPS[P] extends (...args: infer A) => infer R
        ? SelectorOptions<A, R>
        : never;
    },
    NRP extends Record<string, (...args: any[]) => any>,
  >(
    nextProto: NPS | (new (...args: any[]) => NPS),
    options: BoxFactoryOptions<NPS, NRM, NRS, NRP>,
  ): BoxFactory<NPS, (keyof NRM | KM) & keyof NPS, (keyof NRS | KS) & keyof NPS, RP & NRP>;
}

export interface BoxFactoryOptions<
  PS,
  RM extends { [P in keyof PS]?: PS[P] extends (...args: infer A) => infer R ? {} : never },
  RS extends {
    [P in keyof PS]?: PS[P] extends (...args: infer A) => infer R ? SelectorOptions<A, R> : never;
  },
  RP extends Record<string, (...args: any[]) => any>,
> {
  mutations: RM;
  selectors: RS;
  methods: RP;
}

export function createBoxFactory<
  PS,
  RM extends { [P in keyof PS]?: PS[P] extends (...args: infer A) => infer R ? {} : never },
  RS extends {
    [P in keyof PS]?: PS[P] extends (...args: infer A) => infer R ? SelectorOptions<A, R> : never;
  },
  RP extends Record<string, (...args: any[]) => any>,
>(
  proto: PS | (new (...args: any[]) => PS),
  options: BoxFactoryOptions<PS, RM, RS, RP>,
): BoxFactory<PS, keyof RM & keyof PS, keyof RS & keyof PS, RP> {
  const { mutations, selectors, methods } = options;

  function createBox<S>(
    key: string,
    initialState: S,
    options?: BoxOptions<S>,
  ): BoxWithStateMethods<S, keyof RM & keyof S, keyof RS & keyof S> {
    const box = new Box(key, initialState, options);
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
          value: selector((select: any, ...args) => select(box)[ks](...args), selectors[ks]),
        });
      }
    }
    return box as any;
  }

  createBox.extend = function <
    NPS,
    NRM extends { [P in keyof NPS]?: NPS[P] extends (...args: infer A) => infer R ? {} : never },
    NRS extends {
      [P in keyof NPS]?: NPS[P] extends (...args: infer A) => infer R
        ? SelectorOptions<A, R>
        : never;
    },
    NRP extends Record<string, (...args: any[]) => any>,
  >(
    nextProto: NPS | (new (...args: any[]) => NPS),
    options: BoxFactoryOptions<NPS, NRM, NRS, NRP>,
  ): BoxFactory<
    NPS,
    (keyof NRM | keyof RM) & keyof NPS,
    (keyof NRS | keyof RS) & keyof NPS,
    RP & NRP
  > {
    return createBoxFactory<NPS, RM & NRM, RS & NRS, RP & NRP>(nextProto, {
      mutations: { ...mutations, ...options.mutations },
      selectors: { ...selectors, ...options.selectors },
      methods: { ...methods, ...options.methods },
    });
  };

  return createBox as any;
}
