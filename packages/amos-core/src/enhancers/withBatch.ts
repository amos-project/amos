/*
 * @since 2022-02-17 23:27:38
 * @author acrazing <joking.young@gmail.com>
 */

import { isArray, override } from 'amos-utils';
import { action } from '../action';
import { StoreEnhancer } from '../store';
import { Dispatchable } from '../types';

const batch = action(
  (dispatch, select, dispatchableList: Dispatchable[]) => {
    return dispatchableList.map((d) => dispatch(d));
  },
  {
    type: '$$BATCH$$',
  },
);

export const withBatch: () => StoreEnhancer = () => {
  return (next) => (options) => {
    const store = next(options);
    override(store, 'dispatch', (dispatch) => {
      return (tasks: any): any => {
        return isArray(tasks) ? store.dispatch(batch(tasks)) : dispatch(tasks);
      };
    });
    override(store, 'select', (select) => {
      return (selectable: any): any => {
        return Array.isArray(selectable) ? selectable.map(store.select) : select(selectable);
      };
    });
    return store;
  };
};
