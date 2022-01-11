/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { BoxWithStateMethods, createBoxFactory, Mutation, Selector } from 'amos-core';
import { Record, RecordProps } from 'amos-shapes';
import { CtorValue, resolveCtorValue } from 'amos-utils';

export type RecordBox<R extends Record<any>> = BoxWithStateMethods<R, 'merge', 'isValid'> & {
  /** @see {Record#get} */
  get<K extends keyof RecordProps<R>>(key: K): Selector<[K], R[K]>;

  /** @see {Record#set} */
  set<K extends keyof RecordProps<R>>(key: K, value: R[K]): Mutation<[K, R[K]], R>;
  /** @see {Record#update} */
  update<K extends keyof RecordProps<R>>(
    key: K,
    updater: (value: R[K], record: R) => R[K],
  ): Mutation<[K, (value: R[K], record: R) => R[K]], R>;
};

export const RecordBox = createBoxFactory<RecordBox<any>>({
  name: 'RecordBox',
  mutations: { set: null, update: null, merge: null },
  selectors: { isValid: null, get: null },
});

export function createRecordBox<R extends Record<any>>(
  key: string,
  initialState: CtorValue<R>,
): RecordBox<R> {
  return new RecordBox(key, resolveCtorValue(initialState) as any);
}
