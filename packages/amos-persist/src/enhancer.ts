/*
 * @since 2021-07-18 15:12:36
 * @author junbao <junbao@mymoement.com>
 */

import { StoreEnhancer } from 'amos-core';
import { append, NotImplemented, override, PartialRequired } from 'amos-utils';
import { persistBox } from './boxes';
import { PersistOptions } from './types';

export function withPersist(options: PartialRequired<PersistOptions, 'storage'>): StoreEnhancer {
  return (next) => (_options) => {
    const store = next(_options);
    const loading = new Map<string, Promise<any>>();
    const persisted: Record<string, any> = {};

    const final: PersistOptions = {
      onError: (e) => console.error(`[Amos]: failed to persist.`, e),
      ...options,
    };

    append(store, 'init', () => {
      store.dispatch(persistBox.setState({ options: final, hydrating: loading, persisted }));
    });

    override(store, 'select', (select) => {
      return (selectable: any): any => {
        throw new NotImplemented();
      };
    });
    return store;
  };
}
