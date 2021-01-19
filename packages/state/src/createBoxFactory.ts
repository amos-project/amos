/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, FunctionSelector, JSONState, Mutation } from '@kcats/core';

export type BoxWithStateMethods<S, KM extends keyof S, KS extends keyof S> = Box<S> &
  {
    [P in keyof S & (KM | KS)]: P extends KM
      ? S[P] extends (...args: infer A) => S
        ? (...args: A) => Mutation<A[0], A, S>
        : never
      : P extends KS
      ? S[P] extends (...args: infer A) => infer R
        ? (...args: A) => FunctionSelector<A>
        : never
      : never;
  };

export interface BoxFactory<PS, KM extends keyof PS, KS extends keyof PS> {
  <S>(
    key: string,
    initialState: S,
    preload?: (preloadedState: JSONState<S>, state: S) => S,
  ): BoxWithStateMethods<S, KM & keyof S, KS & keyof S>;
  extend<
    NPS,
    NRM extends { [P in keyof NPS]?: true /* always true */ },
    NRS extends { [P in keyof NPS]?: boolean /* cache type */ }
  >(
    nextProto: NPS | (new (...args: any[]) => NPS),
    nextMutations: NRM,
    nextSelectors: NRS,
  ): BoxFactory<NPS, (keyof NRM | KM) & keyof NPS, (keyof NRS | KS) & keyof NPS>;
}

export function createBoxFactory<
  PS,
  RM extends { [P in keyof PS]?: true /* always true */ },
  RS extends { [P in keyof PS]?: boolean /* cache type */ }
>(
  proto: PS | (new (...args: any[]) => PS),
  mutations: RM,
  selectors: RS,
): BoxFactory<PS, keyof RM & keyof PS, keyof RS & keyof PS> {
  const boxProto = Object.create(Box.prototype);
  for (const km in mutations) {
    if (mutations.hasOwnProperty(km)) {
      Object.defineProperty(boxProto, km, {
        value: function (this: Box<PS>, ...args: any[]): Mutation {
          return {
            object: 'mutation',
            box: this,
            type: `${this.key}/${km}`,
            result: args[0],
            args: [],
            mutator: (state) => state[km](...args),
          };
        },
      });
    }
  }
  for (const ks in selectors) {
    if (selectors.hasOwnProperty(ks)) {
      Object.defineProperty(boxProto, ks, {
        value: function (this: Box<PS>, ...args: any[]): FunctionSelector<any> {
          return (select) => (select(this) as any)[ks](...args);
        },
      });
    }
  }

  function createBox<S>(
    key: string,
    initialState: S,
    preload?: (preloadedState: JSONState<S>, state: S) => S,
  ): Box<S> & BoxWithStateMethods<S, keyof RM & keyof S, keyof RS & keyof S> {
    const box = new Box(key, initialState, preload);
    Object.setPrototypeOf(box, boxProto);
    return box as any;
  }

  createBox.extend = function <
    NPS,
    NRM extends { [P in keyof NPS]?: true /* always true */ },
    NRS extends { [P in keyof NPS]?: boolean /* cache type */ }
  >(
    nextProto: NPS | (new (...args: any[]) => NPS),
    nextMutations: NRM,
    nextSelectors: NRS,
  ): BoxFactory<NPS, (keyof NRM | keyof RM) & keyof NPS, (keyof NRS | keyof RS) & keyof NPS> {
    return createBoxFactory<NPS, RM & NRM, RS & NRS>(
      nextProto,
      { ...mutations, ...nextMutations },
      { ...selectors, ...nextSelectors },
    );
  };

  return createBox as any;
}
