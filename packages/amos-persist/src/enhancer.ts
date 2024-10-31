/*
 * @since 2021-07-18 15:12:36
 * @author junbao <junbao@mymoement.com>
 */

import { Box, type Selectable, type Selector, StoreEnhancer } from 'amos-core';
import { append, isAmosObject, override, PartialRequired } from 'amos-utils';
import { createHydrate } from './hydrate';
import { createPersist } from './persist';
import { persistBox, type PersistState } from './state';
import { PersistOptions, type PersistRowKey } from './types';
import { shouldPersist } from './utils';

export function withPersist(options: PartialRequired<PersistOptions, 'storage'>): StoreEnhancer {
  return (next) => (_options) => {
    const store = next(_options);

    const finalOptions: PersistOptions = {
      onError: (e) => console.error(`[Amos]: failed to persist.`, e),
      ...options,
    };

    const hydrate = createHydrate(store, finalOptions);
    const persist = createPersist(store, finalOptions);

    const state: PersistState = {
      ...finalOptions,
      selecting: false,
      initial: new Map(),
      snapshot: new Map(),
      hydrate,
      persist,
    };

    append(store, 'onInit', () => store.dispatch(persistBox.setState(state)));
    append(store, 'onMount', (box, initialState, preloadedState) => {
      state.initial.set(box.key, initialState);
    });

    let selectingRows: PersistRowKey<any> | undefined = void 0;
    override(store, 'select', (select) => {
      return (selectable: any): any => {
        const isSelector = isAmosObject<Selector>(selectable, 'selector');
        const isBox = isAmosObject<Box>(selectable, 'box');
        // No select allowed here is for simplify the select stack.
        const loadRows = isSelector ? selectable.loadRow?.(...selectable.args) : void 0;
        if (loadRows) {
          selectingRows = loadRows;
        }
        try {
          const r = select(selectable as Selectable);
          if (state.selecting) {
            return r;
          }
          // hydrate rows for multi-row boxes
          if (
            loadRows &&
            r === loadRows[0].table!.getRow(state.initial.get(loadRows[0].key), loadRows[1]) &&
            shouldPersist(finalOptions, loadRows[0])
          ) {
            hydrate(loadRows);
          }
          // load entire box only if the box is not multi-row box
          if (
            !loadRows &&
            isBox &&
            !selectable.table &&
            !selectingRows &&
            r === state.initial.get(selectable.key) &&
            shouldPersist(finalOptions, selectable)
          ) {
            hydrate(selectable);
          }
          return r;
        } finally {
          if (loadRows) {
            selectingRows = void 0;
          }
        }
      };
    });

    store.subscribe(persist);
    return store;
  };
}
