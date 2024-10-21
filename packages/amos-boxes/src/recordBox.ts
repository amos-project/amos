/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, Mutation, Selector, ShapeBox } from 'amos-core';
import { Record, RecordProps } from 'amos-shapes';
import { resolveCtorValue, ValueOrConstructor } from 'amos-utils';

export interface RecordBox<R extends Record<any>>
  extends ShapeBox<R, 'merge', 'isValid', Box<R>, Record<{}>> {
  /** @see {Record#get} */
  get<K extends keyof RecordProps<R>>(key: K): Selector<[K], R[K]>;
  /** @see {Record#set} */
  set<K extends keyof RecordProps<R>>(key: K, value: R[K]): Mutation<[K, R[K]], R>;
  /** @see {Record#update} */
  update<K extends keyof RecordProps<R>>(
    key: K,
    updater: (value: R[K], record: R) => R[K],
  ): Mutation<[K, (value: R[K], record: R) => R[K]], R>;
}

export const RecordBox = Box.extends<RecordBox<any>>({
  name: 'RecordBox',
  mutations: { set: null, update: null, merge: null },
  selectors: { isValid: null, get: null },
});

export function recordBox<R extends Record<any>>(
  key: string,
  initialState: ValueOrConstructor<R>,
): RecordBox<R> {
  return new RecordBox(key, resolveCtorValue(initialState) as any);
}
