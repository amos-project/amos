/*
 * @since 2021-08-02 10:50:14
 * @author junbao <junbao@mymoement.com>
 */

import { applyEnhancers } from 'amos-utils';
import { Store, StoreOptions } from './store';
import { Snapshot } from './types';

export type StoreEnhancer = (StoreClass: typeof Store) => typeof Store;

export function createStore(
  preloadedState: Snapshot = {},
  options: StoreOptions = {},
  ...enhancers: StoreEnhancer[]
): Store {
  const store = new (applyEnhancers(Store, enhancers))(preloadedState, options).init();
  store.init();
  return store;
}
