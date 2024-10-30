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
      snapshot: {},
      hydrate,
      persist,
    };

    append(store, 'init', () => store.dispatch(persistBox.setState(state)));

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
          if (
            loadRows &&
            r === loadRows[0].table!.getRow(loadRows[0].initialState, loadRows[1]) &&
            shouldPersist(finalOptions, loadRows[0])
          ) {
            hydrate(loadRows);
          }
          if (
            !loadRows &&
            isBox &&
            !selectingRows &&
            r === selectable.initialState &&
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
