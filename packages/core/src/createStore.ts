/*
 * @since 2021-08-02 10:50:14
 * @author junbao <junbao@mymoement.com>
 */

import { withCache } from './enhancers/withCache';
import { withTransaction } from './enhancers/withTransaction';
import { Store, StoreOptions } from './store';

export type StoreEnhancer = (
  next: (options: StoreOptions) => Store,
) => (options: StoreOptions) => Store;

export function createStore(options: StoreOptions = {}, ...enhancers: StoreEnhancer[]): Store {
  enhancers.unshift(withTransaction(), withCache());
  // TODO
  store.init();
  return store;
}
