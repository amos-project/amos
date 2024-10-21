/*
 * @since 2024-10-17 20:04:24
 * @author junbao <junbao@moego.pet>
 */

import { Box, Mutation, Selector } from 'amos-core';
import { resolveFuncValue } from 'amos-utils';

export interface ObjectBox<T extends object> extends Box<Readonly<T>> {
  mergeState(state: Partial<T>): Mutation<[state: Partial<T>], Readonly<T>>;
  mergeState(
    next: (state: Readonly<T>) => Partial<T>,
  ): Mutation<[next: (state: Readonly<T>) => Partial<T>], Readonly<T>>;
  get<K extends keyof T>(key: K): Selector<[K], T[K]>;
}

export const ObjectBox = Box.extends<ObjectBox<any>>({
  name: 'ObjectBox',
  mutations: {
    mergeState: (state, next) => ({ ...state, ...resolveFuncValue(next, state) }),
  },
  selectors: {
    get: { derive: (state, key) => state[key as string] },
  },
});

export function objectBox<T extends object>(key: string, initialState: T): ObjectBox<T> {
  return new ObjectBox(key, initialState);
}
