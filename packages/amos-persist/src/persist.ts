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
  return nextSerialTicker<void>(async () => {
    const state = store.select(persistBox)!;
    const snapshot = store.snapshot();
    const entries: PersistEntry[] = [];
    const removes: string[] = [];
    for (const k in snapshot) {
      const box = Box.get(k);
      if (!shouldPersist(state, box)) {
        continue;
      }
      const curr = snapshot[k];
      const prev = state.snapshot[k];
      const hasPrev = Object.hasOwn(state.snapshot, k);
      if (hasPrev ? curr === prev : curr === box.initialState) {
        continue;
      }
      state.snapshot[k] = curr;
      if (box.table) {
        const currRows = box.table.toRows(curr);
        const prevRows = hasPrev ? box.table.toRows(prev) : {};
        for (const k in currRows) {
          if (prevRows[k] !== currRows[k]) {
            entries.push([toKey(box, k), toPersistOptions(box).version, currRows[k]]);
          }
        }
        for (const k in prevRows) {
          if (!Object.hasOwn(currRows, k)) {
            removes.push(k);
          }
        }
      } else {
        entries.push([toKey(box), toPersistOptions(box).version, curr]);
      }
    }
    await Promise.all([
      entries.length ? state.storage.setMulti(entries) : void 0,
      removes.length ? state.storage.removeMulti(removes) : void 0,
    ]);
  }, finalOptions.onError);
};
