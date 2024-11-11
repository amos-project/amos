/*
 * @since 2024-10-29 20:41:17
 * @author junbao <junbao@moego.pet>
 */

import { Box, type Mutation, type Store } from 'amos-core';
import { fromJS, type ID, isArray, must, nextSerialTicker } from 'amos-utils';
import { persistBox } from './state';
import type { PersistEntry, PersistKey, PersistOptions } from './types';
import { fromKey, toKey, toPersistOptions } from './utils';

export const createHydrate = (store: Store, finalOptions: PersistOptions) => {
  return nextSerialTicker<PersistKey<any>, void>(async (items) => {
    const state = store.select(persistBox)!;
    await state.init();

    function migrate(box: Box, v: number, id: string, d: any) {
      const opts = toPersistOptions(box);
      if (opts.version !== v) {
        if (!opts.migrate) {
          return void 0;
        }
        return store.dispatch(opts.migrate(v, id, d));
      }
      return d;
    }

    const targets = new Map<string, null | Set<ID> | undefined>();

    const addRow = (box: Box, rowId?: ID) => {
      if (rowId === void 0) {
        if (state.hydrated.has(toKey(box))) {
          return;
        }
        state.hydrated.add(toKey(box));
        targets.set(box.key, box.table ? null : void 0);
      } else if (state.hydrated.has(toKey(box)) || state.hydrated.has(toKey(box, rowId))) {
        return;
      } else {
        must(box.table, `${box.key} is not a multi-row box`);
        state.hydrated.add(toKey(box, rowId));
        if (!targets.has(box.key)) {
          targets.set(box.key, new Set());
        }
        targets.get(box.key)?.add(rowId);
      }
    };

    for (const key of items) {
      if (isArray(key)) {
        if (isArray(key[1])) {
          for (const rowId of key[1]) {
            addRow(key[0], rowId);
          }
        } else {
          addRow(key[0], key[1]);
        }
      } else {
        addRow(key);
      }
    }

    const prefixBoxes: string[] = [];
    const exactKeys: [string, ID | undefined][] = [];
    targets.forEach((rows, key) => {
      if (rows === null) {
        prefixBoxes.push(key);
      } else if (rows === void 0) {
        exactKeys.push([key, void 0]);
      } else {
        rows!.forEach((id) => exactKeys.push([key, id]));
      }
    });

    if (prefixBoxes.length === 0 && exactKeys.length === 0) {
      return;
    }

    const [prefixes, exacts] = await Promise.all([
      Promise.all(prefixBoxes.map((key) => state.storage.getPrefix(toKey(key, null)))),
      exactKeys.length ? state.storage.getMulti(exactKeys.map(([k, i]) => toKey(k, i))) : [],
    ]);

    const tablePrefixMap: Record<string, PersistEntry[]> = {};
    const exactEntries: Mutation[] = [];
    exacts.forEach((value, index) => {
      if (value === null) {
        return;
      }
      const [key, rowId] = exactKeys[index];
      const box = Box.get(key);
      if (rowId !== void 0) {
        if (!tablePrefixMap[key]) {
          tablePrefixMap[key] = [];
          prefixBoxes.push(key);
          prefixes.push(tablePrefixMap[key]);
        }
        tablePrefixMap[key].push([toKey(key, rowId), ...value]);
      } else if (state.select(box) === state.getInitial(box)[0]) {
        const js = migrate(box, value[0], '', value[1]);
        if (js !== void 0) {
          exactEntries.push(box.setState(fromJS(state.getInitial(box)[0], js)));
        }
      }
    });

    store.dispatch(
      prefixes
        .map((p, i): Mutation[] => {
          const box = Box.get(prefixBoxes[i]);
          const curr = state.select(box);
          const data: Record<string, any> = {};
          for (let [k, v, d] of p) {
            const id = fromKey(k);
            if (id === void 0) {
              continue;
            }
            if (box.table!.getRow(curr, id) !== box.table!.getRow(state.getInitial(box)[0], id)) {
              continue;
            }
            d = migrate(box, v, id, d);
            if (d !== void 0) {
              data[id] = d;
            }
          }
          if (Object.keys(data).length === 0) {
            return [];
          }
          return [box.setState(box.table!.hydrate(curr, data))];
        })
        .flat()
        .concat(exactEntries),
    );
  }, finalOptions.onError);
};
