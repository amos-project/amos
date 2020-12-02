/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, Mutation } from '../core/box';
import { FunctionSelector } from '../core/selector';
import { JSONState } from '../core/types';

export function createBoxFactory<PS, KS extends keyof PS, KG extends keyof PS>(
  proto: PS | (new (...args: any[]) => PS),
  setters: readonly KS[],
  getters: readonly KG[],
) {
  const boxProto = Object.create(Box.prototype);
  for (const ks of setters) {
    Object.defineProperty(boxProto, ks, {
      value: function (this: Box<PS>, ...args: any[]): Mutation {
        return {
          object: 'mutation',
          box: this,
          type: `${this.key}/${ks}`,
          result: args[0],
          args: [],
          mutator: (state) => state[ks](...args),
        };
      },
    });
  }
  for (const kg of getters) {
    Object.defineProperty(boxProto, kg, {
      value: function (this: Box<PS>, ...args: any[]): FunctionSelector<any> {
        return (select) => (select(this) as any)[kg](...args);
      },
    });
  }

  function createBox<S>(
    key: string,
    initialState: S,
    preload?: (preloadedState: JSONState<S>, state: S) => S,
  ): Box<S> &
    {
      [P in keyof S & (KS | KG)]: P extends KS
        ? S[P] extends (...args: infer A) => S
          ? (...args: A) => Mutation<A[0], A, S>
          : never
        : P extends KG
        ? S[P] extends (...args: infer A) => infer R
          ? (...args: A) => FunctionSelector<A>
          : never
        : never;
    } {
    const box = new Box(key, initialState, preload);
    Object.setPrototypeOf(box, boxProto);
    return box as any;
  }

  createBox.extend = function <NPS extends PS, NKS extends keyof NPS, NKG extends keyof NPS>(
    nextProto: NPS | (new (...args: any[]) => NPS),
    nextSetters: readonly NKS[],
    nextGetters: readonly NKG[],
  ) {
    return createBoxFactory<NPS, NKS | KS, NKG | KG>(
      nextProto,
      [...setters, ...nextSetters],
      [...getters, ...nextGetters],
    );
  };

  return createBox;
}
