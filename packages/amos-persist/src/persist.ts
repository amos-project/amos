/*
 * @since 2024-10-29 20:44:07
 * @author junbao <junbao@moego.pet>
 */

import { Box, type Store } from 'amos-core';
import { nextSerialTicker } from 'amos-utils';
import { persistBox } from './state';
import type { PersistEntry, PersistOptions } from './types';
import { shouldPersist, toKey, toPersistOptions } from './utils';

export const createPersist = (store: Store, finalOptions: PersistOptions) => {
  return nextSerialTicker<void, void>(async () => {
    const state = store.select(persistBox)!;
    const snapshot = store.snapshot();
    const entries: PersistEntry[] = [];
    const removes: string[] = [];
    const removePrefixes: string[] = [];
    for (const k in snapshot) {
      const box = Box.get(k);
      if (!shouldPersist(state, box)) {
        continue;
      }
      const curr = snapshot[k];
      const prev = state.snapshot.has(k);
      const hasPrev = state.snapshot.has(k);
      if (hasPrev ? curr === prev : curr === state.initial.get(box.key)) {
        continue;
      }
      state.snapshot.set(k, curr);
      if (box.table) {
        const currRows = box.table.toRows(curr);
        const prevRows = box.table.toRows(hasPrev ? prev : state.initial.get(box.key));
        const keys = Object.keys(currRows);
        if (keys.length === 0) {
          removePrefixes.push(toKey(box));
        } else {
          for (const k of keys) {
            if (prevRows[k] !== currRows[k]) {
              entries.push([toKey(box, k), toPersistOptions(box).version, currRows[k]]);
            }
          }
          for (const k in prevRows) {
            if (!Object.hasOwn(currRows, k)) {
              removes.push(toKey(box, k));
            }
          }
        }
      } else {
        entries.push([toKey(box), toPersistOptions(box).version, curr]);
      }
    }
    await Promise.all([
      entries.length ? state.storage.setMulti(entries) : void 0,
      removes.length ? state.storage.removeMulti(removes) : void 0,
      ...removePrefixes.map((p) => state.storage.removePrefix(p)),
    ]);
  }, finalOptions.onError);
};
