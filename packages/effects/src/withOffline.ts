/*
 * @since 2022-01-17 14:17:31
 * @author junbao <junbao@moego.pet>
 */

import { StoreEnhancer } from 'amos-core';

export interface OfflineOptions {}

export function withOffline(options: OfflineOptions): StoreEnhancer {
  return (StoreClass) => {
    return class OfflineStore extends StoreClass {};
  };
}
