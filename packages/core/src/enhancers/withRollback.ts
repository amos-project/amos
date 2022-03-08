/*
 * @since 2022-03-07 15:52:43
 * @author junbao <junbao@moego.pet>
 */

import { override } from 'amos-utils';
import { StoreEnhancer } from '../createStore';

export const withRollback = (): StoreEnhancer => (next) => (options) =>
  override(next(options), 'dispatch', (original) => (task: any) => {
    // TODO
    return original(task) as any;
  });
