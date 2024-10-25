/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, Mutation, Selector, ShapeBox } from 'amos-core';
import { Record, RecordProps } from 'amos-shapes';
import { resolveConstructorValue, ValueOrConstructor } from 'amos-utils';

export interface RecordBox<R extends Record<any>>
  extends Box<R>,
    ShapeBox<R, 'merge', 'isInitial', Record<{}>> {
  /** @see {Record#get} */
  get<K extends keyof RecordProps<R>>(key: K): Selector<R[K]>;
  /** @see {Record#set} */
  set<K extends keyof RecordProps<R>>(key: K, value: R[K]): Mutation<R>;
  /** @see {Record#update} */
  update<K extends keyof RecordProps<R>>(
    key: K,
    updater: (value: R[K], record: R) => R[K],
  ): Mutation<R>;
}

export const RecordBox = Box.extends<RecordBox<any>>({
  name: 'RecordBox',
  mutations: { set: null, update: null, merge: null },
  selectors: { isInitial: null, get: null },
});

export function recordBox<R extends Record<any>>(
  key: string,
  initialState: ValueOrConstructor<R>,
): RecordBox<R> {
  return new RecordBox(key, resolveConstructorValue(initialState) as any);
}
