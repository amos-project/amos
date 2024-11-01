/*
 * @since 2024-10-20 16:28:54
 * @author junbao <junbao@moego.pet>
 */

import { isAmosObject, override } from 'amos-utils';
import { Action } from '../action';
import { StoreEnhancer } from '../store';
import { computeCacheKey } from '../utils';

export function withConcurrent(): StoreEnhancer {
  return (next) => (options) => {
    const store = next(options);
    const pending = new Map<any, Promise<any>>();
    override(store, 'dispatch', (dispatch) => {
      return (d: any) => {
        if (!isAmosObject<Action>(d, 'action') || d.conflictPolicy !== 'leading') {
          return dispatch(d);
        }
        const key = computeCacheKey(store.select, d, d.conflictKey);
        if (pending.has(key)) {
          return pending.get(key)!;
        }
        const v = dispatch(d);
        if (!(v instanceof Promise)) {
          return v;
        }
        pending.set(key, v);
        v.finally(() => pending.delete(key));
        return v;
      };
    });
    return store;
  };
}
