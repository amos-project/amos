/*
 * @since 2024-10-17 20:04:24
 * @author junbao <junbao@moego.pet>
 */

import { Box, Mutation, Selector } from 'amos-core';
import { resolveFuncValue, shallowEqual, type ValueOrFunc } from 'amos-utils';

export interface ObjectBox<T extends object> extends Box<Readonly<T>> {
  mergeState(state: ValueOrFunc<Partial<Readonly<T>>, [Readonly<T>]>): Mutation<Readonly<T>>;
  set<K extends keyof T>(key: K, value: T[K]): Mutation<T>;
  get<K extends keyof T>(key: K): Selector<[K], T[K]>;
  pick<Ks extends Array<keyof T>>(...keys: Ks): Selector<Ks, Pick<T, Ks[number]>>;
}

export const ObjectBox = Box.extends<ObjectBox<any>>({
  name: 'ObjectBox',
  mutations: {
    mergeState: (state, next) => ({ ...state, ...resolveFuncValue(next, state) }),
    set: (state, key, value) => {
      return state[key as string] === value ? state : { ...state, [key]: value };
    },
  },
  selectors: {
    get: { derive: (state, key) => state[key as string] },
    pick: {
      derive: (state, ...keys) => Object.fromEntries(keys.map((k) => [k, state[k as any]])),
      equal: shallowEqual,
    },
  },
});

export function objectBox<T extends object>(key: string, initialState: ValueOrFunc<T>): ObjectBox<T> {
  return new ObjectBox(key, initialState);
}
