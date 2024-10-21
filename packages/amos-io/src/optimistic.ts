/*
 * @since 2022-01-17 14:17:31
 * @author junbao <junbao@moego.pet>
 */

import { StoreEnhancer } from 'amos-core';

export interface OptimisticOptions {}

export function withOptimistic(options: OptimisticOptions): StoreEnhancer {
  return (next) => (options) => next(options);
}
