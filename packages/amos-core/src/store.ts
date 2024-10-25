/*
 * @since 2021-08-02 10:50:14
 * @author junbao <junbao@mymoement.com>
 */

import {
  $amos,
  applyEnhancers,
  createEventCenter,
  Enhancer,
  isAmosObject,
  isObject,
  toType,
  Unsubscribe,
} from 'amos-utils';
import { Box } from './box';
import { withBatch } from './enhancers/withBatch';
import { withCache } from './enhancers/withCache';
import { withConcurrent } from './enhancers/withConcurrent';
import { DevtoolsOptions, withDevtools } from './enhancers/withDevtools';
import { withPreload } from './enhancers/withPreload';
import { Dispatch, Dispatchable, Select, Selectable } from './types';

export type Snapshot = Record<string, unknown>;

export interface StoreOptions {
  /**
   * The preloaded state, which will be loaded to the store with {@link fromJS}.
   * This is effective for {@link withPreload}, which is always loaded.
   */
  preloadedState?: Snapshot;

  /**
   * The store name, use for devtools
   */
  name?: string;

  /**
   * Enable devtools or not, if not set, will auto enable devtools if NODE_ENV
   * is development.
   */
  devtools?: DevtoolsOptions | boolean;
}

export interface Store {
  /**
   * Get the state snapshot or the store
   */
  snapshot: () => Readonly<Snapshot>;

  /**
   * Subscribe the update of the store. The event contains all mutated boxes
   * and its original state.
   *
   * It only will be fired after the root dispatch completed.
   */
  subscribe: (fn: () => void) => Unsubscribe;

  /**
   * Dispatch a dispatchable object to update the state of the store.
   */
  dispatch: Dispatch;

  /**
   * Select state of a box or selector.
   */
  select: Select;
}

export interface EnhanceableStore extends Store {
  /**
   * The mutable state of the store.
   */
  state: Snapshot;

  /**
   * Get initial state for box, default is {@link Box#initialState}.
   * If {@link StoreOptions#preloadedState} is set, will be parsed by
   * {@link import('amos-utils').fromJS}.
   */
  getInitialState: <S>(box: Box<S>) => S;

  /**
   * This function will be called after the store created.
   */
  init: () => void;
}

export type StoreEnhancer = Enhancer<[StoreOptions], EnhanceableStore>;

export function createStore(options: StoreOptions = {}, ...enhancers: StoreEnhancer[]): Store {
  const store = applyEnhancers(
    [withDevtools(), withBatch(), withConcurrent(), withCache(), withPreload(), ...enhancers],
    [options],
    (): EnhanceableStore => {
      const ec = createEventCenter<[]>();
      let isDispatching = false;
      return {
        state: {},
        getInitialState: (box) => box.initialState,
        init: () => void 0,
        snapshot: () => store.state,
        subscribe: ec.subscribe,
        // only accepts Dispatchable here
        dispatch: (_task: any) => {
          const task: Dispatchable = _task;
          if (!isObject(task)) {
            throw new Error(`dispatching non-dispatchable type: ${toType(task)}`);
          }
          const isRoot = !isDispatching;
          isDispatching ||= true;
          try {
            let r: any;
            switch (task[$amos]) {
              case 'action':
                r = task.actor(store.dispatch, store.select, ...task.args);
                break;
              case 'mutation':
                const initialState = store.select(task.box);
                r = task.mutator(initialState);
                store.state[task.box.key] = r;
                break;
              case 'signal':
                r = task.creator(store.select, ...task.args);
                task.factory.dispatch(store.dispatch, store.select, r);
                break;
              default:
                throw new Error(
                  `dispatching non-dispatchable object: ${task[$amos] || toType(task)}`,
                );
            }
            if (isRoot) {
              isDispatching = false;
              ec.dispatch();
            }
            return r;
          } finally {
            if (isRoot && isDispatching) {
              isDispatching = false;
            }
          }
        },
        select: (_selectable: any): any => {
          const selectable: Selectable = _selectable;
          if (isAmosObject<Box>(selectable, 'box')) {
            if (!store.state.hasOwnProperty(selectable.key)) {
              store.state[selectable.key] = store.getInitialState(selectable);
            }
            return store.state[selectable.key];
          }
          return selectable.compute(store.select);
        },
      };
    },
  );
  store.init();
  return {
    snapshot: store.snapshot,
    subscribe: store.subscribe,
    dispatch: store.dispatch,
    select: store.select,
  };
}
