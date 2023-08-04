/*
 * @since 2022-02-17 23:27:38
 * @author acrazing <joking.young@gmail.com>
 */

import { override } from 'amos-utils';
import { action } from '../action';
import { StoreEnhancer } from '../createStore';
import { Dispatchable } from '../types';

const transaction = action((dispatch, select, dispatchableList: Dispatchable[]) =>
  dispatchableList.map((d) => dispatch(d)),
);

export const withTransaction: () => StoreEnhancer = () => (next) => (options) =>
  override(
    next(options),
    'dispatch',
    (original) =>
      (tasks: any): any =>
        Array.isArray(tasks) ? original(transaction(tasks)) : original(tasks),
  );
