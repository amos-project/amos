/*
 * @since 2024-10-17 11:48:53
 * @author junbao <junbao@moego.pet>
 */

import {
  type Action,
  action,
  type ActionFactory,
  type ActionFactoryStatic,
  Actor,
  type Box,
  type Dispatch,
  type Mutation,
  type Select,
} from 'amos-core';
import { defer, type ID, isAmosObject, isArray, must, toArray } from 'amos-utils';
import { persistBox } from './boxes';
import type { MapPersistKeys, PersistEntry, PersistKey } from './types';
import { fromKey, toKey, toPersistOptions } from './utils';

export interface HydrateState extends ActionFactoryStatic {
  <K extends PersistKey<any>[]>(...keys: K): Action<K, Promise<MapPersistKeys<K>>>;
}

/**
 * Hydrate the persisted rows to store.
 *
 * We only (and always) hydrate when:
 * 1. If the box is single row, the current state is same to its initialState
 * 2. If the box is multi-row, the current state does not have target row or the
 *    current state's that row is same to the initialState's that row.
 *
 * Which means: if your preloaded state is same to the initialState, it will be
 * overwritten by persisted one.
 */
export const hydrateState: HydrateState = action(
  async (dispatch: Dispatch, select: Select, ...keys: PersistKey<any>[]): Promise<any[]> => {
    const state = select(persistBox);
    must(state, 'persist middleware is not enabled');
    const p = defer();

    await p.exec(async () => {
      const promises = new Set<Promise<void>>();
      const targets = new Map<string, [Box, null | Set<string> | undefined]>();

      const addRow = (box: Box, rowId: ID | undefined) => {
        if (!boxes.has(box.key)) {
          boxes.set(box.key, box);
        }
        const rowKey = toKey(box, rowId);
        if (rowId === void 0) {
          // prefix or multi row
          if (state.hydrating.has(rowKey)) {
            promises.add(state.hydrating.get(rowKey)!);
            targets.delete(box.key);
          } else {
            targets.set(box.key, box.table ? null : new Set(['']));
          }
        } else {
          // load single row
          if (state.hydrating.has(toKey(box, ''))) {
            // already loading all
            promises.add(state.hydrating.get(toKey(box, ''))!);
            targets.delete(rowKey);
          }
        }
      };
      for (const key of keys) {
        if (isArray(key)) {
          for (const rowId of toArray(key[1])) {
            addRow(key[0], rowId);
          }
        } else {
          addRow(key, void 0);
        }
      }

      const prefixItems = Array.from(targets.values())
        .filter((v) => v[1] === null)
        .map(([box]): [Box, string] => {
          return [box, toKey(box, null)];
        });
      prefixItems.forEach(([, key]) => state.hydrating.set(key, p));
      const exactKeys = Array.from(targets.values(), ([box, rows]): [Box, string][] => {
        if (rows === null) {
          return [];
        }
        return rows === void 0
          ? [[box, toKey(box, void 0)]]
          : Array.from(rows, (row) => [box, row]);
      }).flat();
      exactKeys.forEach(([, key]) => state.hydrating.set(key, p));

      const [prefixes, exacts] = await Promise.all([
        Promise.all(prefixItems.map(([box, key]) => state.options.storage.getPrefix(key))),
        state.options.storage.getMulti(exactKeys.map((v) => v[1])),
      ]);

      exacts.reduce(
        (previousValue, currentValue, currentIndex, array) => {
          if (currentValue === null) {
            return previousValue;
          }
          const [box, key] = exactKeys[currentIndex];
          if (!previousValue[box.key]) {
            previousValue[box.key] = [];
            prefixItems.push([box, '']);
          }
          previousValue[box.key].push([key, ...currentValue]);
          return previousValue;
        },
        {} as Record<string, PersistEntry[]>,
      );

      dispatch(
        prefixes
          .map((p, i): Mutation[] => {
            const box = prefixItems[i][0];
            const state = select(box);
            const data: Record<string, any> = {};
            for (let [k, v, d] of p) {
              const id = fromKey(k);
              if (id === void 0) {
                continue;
              }
              if (box.table!.getRow(state, id) !== box.table!.getRow(box.initialState, id)) {
                continue;
              }
              const opts = toPersistOptions(box);
              if (opts.version !== v) {
                if (!opts.migrate) {
                  continue;
                }
                if (isAmosObject<ActionFactory>(opts.migrate, 'action_factory')) {
                  d = dispatch(opts.migrate(v, id, d));
                } else {
                  d = (
                    opts.migrate as Actor<
                      [version: number, row: ID, state: unknown],
                      unknown | undefined
                    >
                  )(dispatch, select, v, id, d);
                }
              }
              data[id] = d;
            }
            if (Object.keys(data).length === 0) {
              return [];
            }
            return [box.setState(box.table!.hydrate(state, data))];
          })
          .flat(),
      );
      await Promise.all(promises);
    });

    return select(keys.map((k) => (isArray(k) ? k[0] : k)));
  },
  {
    conflictKey: (select: Select, ...keys: PersistKey<any>[]) => {
      return keys
        .map((k) => {
          return isAmosObject<Box>(k, 'box')
            ? [k.key]
            : toArray(k[1]).map((id) => k[0].key + ':' + id);
        })
        .flat();
    },
  },
) as HydrateState;
