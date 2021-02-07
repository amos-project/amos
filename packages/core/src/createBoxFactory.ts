/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, MutationFactory } from './box';
import { selector, SelectorFactory } from './selector';
import { JSONState } from './types';
import { strictEqual } from './utils';

export type BoxWithStateMethods<S, KM extends keyof S, KS extends keyof S> = Box<S> &
  {
    [P in keyof S & (KM | KS)]: P extends KM
      ? S[P] extends (...args: infer A) => S
        ? MutationFactory<S, A>
        : never
      : P extends KS
      ? S[P] extends (...args: infer A) => infer R
        ? SelectorFactory<A, R>
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
    NRS extends { [P in keyof NPS]?: boolean /* need cache */ }
  >(
    nextProto: NPS | (new (...args: any[]) => NPS),
    nextMutations: NRM,
    nextSelectors: NRS,
  ): BoxFactory<NPS, (keyof NRM | KM) & keyof NPS, (keyof NRS | KS) & keyof NPS>;
}

export function createBoxFactory<
  PS,
  RM extends { [P in keyof PS]?: true /* always true */ },
  RS extends { [P in keyof PS]?: boolean /* need cache */ }
>(
  proto: PS | (new (...args: any[]) => PS),
  mutations: RM,
  selectors: RS,
): BoxFactory<PS, keyof RM & keyof PS, keyof RS & keyof PS> {
  const boxProto = Object.create(Box.prototype);

  function createBox<S>(
    key: string,
    initialState: S,
    preload?: (preloadedState: JSONState<S>, state: S) => S,
  ): Box<S> & BoxWithStateMethods<S, keyof RM & keyof S, keyof RS & keyof S> {
    const box = new Box(key, initialState, preload);
    Object.setPrototypeOf(box, boxProto);
    for (const km in mutations) {
      if (mutations.hasOwnProperty(km)) {
        Object.defineProperty(box, km, {
          value: box.mutation((state: any, ...args) => state[km](...args), `${key}.${km}`),
        });
      }
    }
    for (const ks in selectors) {
      if (selectors.hasOwnProperty(ks)) {
        Object.defineProperty(boxProto, ks, {
          value: selector(
            (select: any, ...args) => select(box)[ks](...args),
            selectors[ks],
            strictEqual,
            `${key}.${ks}`,
          ),
        });
      }
    }
    return box as any;
  }

  createBox.extend = function <
    NPS,
    NRM extends { [P in keyof NPS]?: true /* always true */ },
    NRS extends { [P in keyof NPS]?: boolean /* need cache */ }
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
