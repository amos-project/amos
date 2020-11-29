/*
 * @since 2020-11-03 13:31:31
 * @author acrazing <joking.young@gmail.com>
 */

import { Action } from './action';
import { Box, Mutation } from './box';
import { Cache } from './cache';
import { FunctionSelector, Selector, SelectorFactory } from './selector';
import { Signal } from './signal';
import { AmosObject, defineAmosObject, isArray } from './utils';

/**
 * the state snapshot in store
 *
 * @stable
 */
export type Snapshot = Record<string, unknown>;

/**
 * dispatchable things
 *
 * @stable
 */
export type Dispatchable<R = any> = Mutation<R> | Action<R> | Signal<R>;

/**
 * base amos signature, this is used for someone want to change the signature of useDispatch()
 *
 * @stable
 */
export interface AmosDispatch extends AmosObject<'store.dispatch'> {
  <R>(task: Dispatchable<R>): R;
  <R1>(tasks: readonly [Dispatchable<R1>]): [R1];
  <R1, R2>(tasks: readonly [Dispatchable<R1>, Dispatchable<R2>]): [R1, R2];
  <R1, R2, R3>(tasks: readonly [Dispatchable<R1>, Dispatchable<R2>, Dispatchable<R3>]): [
    R1,
    R2,
    R3,
  ];
  <R1, R2, R3, R4>(
    tasks: readonly [Dispatchable<R1>, Dispatchable<R2>, Dispatchable<R3>, Dispatchable<R4>],
  ): [R1, R2, R3, R4];
  <R1, R2, R3, R4, R5>(
    tasks: readonly [
      Dispatchable<R1>,
      Dispatchable<R2>,
      Dispatchable<R3>,
      Dispatchable<R4>,
      Dispatchable<R5>,
    ],
  ): [R1, R2, R3, R4, R5];
  <R1, R2, R3, R4, R5, R6>(
    tasks: readonly [
      Dispatchable<R1>,
      Dispatchable<R2>,
      Dispatchable<R3>,
      Dispatchable<R4>,
      Dispatchable<R5>,
      Dispatchable<R6>,
    ],
  ): [R1, R2, R3, R4, R5, R6];
  <R1, R2, R3, R4, R5, R6, R7>(
    tasks: readonly [
      Dispatchable<R1>,
      Dispatchable<R2>,
      Dispatchable<R3>,
      Dispatchable<R4>,
      Dispatchable<R5>,
      Dispatchable<R6>,
      Dispatchable<R7>,
    ],
  ): [R1, R2, R3, R4, R5, R6, R7];
  <R1, R2, R3, R4, R5, R6, R7, R8>(
    tasks: readonly [
      Dispatchable<R1>,
      Dispatchable<R2>,
      Dispatchable<R3>,
      Dispatchable<R4>,
      Dispatchable<R5>,
      Dispatchable<R6>,
      Dispatchable<R7>,
      Dispatchable<R8>,
    ],
  ): [R1, R2, R3, R4, R5, R6, R7, R8];
  <R1, R2, R3, R4, R5, R6, R7, R8, R9>(
    tasks: readonly [
      Dispatchable<R1>,
      Dispatchable<R2>,
      Dispatchable<R3>,
      Dispatchable<R4>,
      Dispatchable<R5>,
      Dispatchable<R6>,
      Dispatchable<R7>,
      Dispatchable<R8>,
      Dispatchable<R9>,
    ],
  ): [R1, R2, R3, R4, R5, R6, R7, R8, R9];
  <R>(tasks: readonly Dispatchable<R>[]): R[];
}

export interface Dispatch extends AmosDispatch {}

/**
 * selectable things
 *
 * @stable
 */
export type Selectable<R = any> =
  | Box<R>
  | FunctionSelector<R>
  | Selector<any[], R>
  | SelectorFactory<[], R>;

export interface Select extends AmosObject<'store.select'> {
  /**
   * select cache strategy
   *
   * 1. cache key: factory + args
   * 2. should recompute: snapshot or deps return value
   * 3. cache mode: if without discard, means it will take/update the latest one,
   *    else it will drop the discard reference, and cache the new one in the tree.
   * 4. who while be cached: selector/factory
   *    if it is called with discard, will put into tree, and drop the discard if
   *    it is free, else it will update the latest.
   *
   * @param selectable
   * @param discard
   */
  <A extends Selectable>(selectable: A, discard?: Selectable): A extends Box<infer S>
    ? S
    : A extends SelectorFactory<[], infer R>
    ? R
    : A extends Selector<any[], infer R>
    ? R
    : A extends FunctionSelector<infer R>
    ? R
    : never;
}

/**
 * Store
 *
 * @stable
 */
export interface Store {
  snapshot: () => Snapshot;
  dispatch: Dispatch;
  subscribe: (fn: () => void) => () => void;
  select: Select;
  clearBoxes: (reloadState: boolean) => void;
}

export type StoreEnhancer = (store: Store) => Store;

/**
 * create a store
 * @param preloadedState
 * @param enhancers
 *
 * @stable
 */
export function createStore(preloadedState?: Snapshot, ...enhancers: StoreEnhancer[]): Store {
  const cache = new Cache();
  let state: Snapshot = {};
  let boxes: Record<string, Box> = {};
  const listeners: Array<() => void> = [];
  const ensure = (box: Box) => {
    if (!boxes.hasOwnProperty(box.key)) {
      boxes[box.key] = box;
    }
    if (state.hasOwnProperty(box.key)) {
      return;
    }
    let boxState = box.initialState;
    if (preloadedState?.hasOwnProperty(box.key)) {
      boxState = box.preload(preloadedState[box.key], boxState);
    }
    state[box.key] = boxState;
  };

  let dispatchDepth = 0;

  const exec = (dispatchable: Dispatchable) => {
    switch (dispatchable.object) {
      case 'action':
        return dispatchable.actor(store.dispatch, store.select, ...dispatchable.args);
      case 'mutation':
        ensure(dispatchable.box);
        const key = dispatchable.box.key;
        state[key] = dispatchable.mutator(state[key], ...dispatchable.args);
        return dispatchable.result;
      case 'signal':
        for (const key in boxes) {
          if (!boxes.hasOwnProperty(key)) {
            continue;
          }
          const box = boxes[key];
          const fn = box.listeners[dispatchable.type];
          if (fn) {
            state[box.key] = fn(state[box.key], dispatchable.data);
          }
        }
        return dispatchable.data;
    }
  };

  let store: Store = {
    snapshot: () => state,
    subscribe: (fn) => {
      listeners.push(fn);
      return () => {
        const index = listeners.indexOf(fn);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
    dispatch: defineAmosObject(
      'store.dispatch',
      (tasks: Dispatchable | readonly Dispatchable[]) => {
        ++dispatchDepth;
        try {
          if (isArray(tasks)) {
            return tasks.map(exec);
          } else {
            return exec(tasks);
          }
        } finally {
          if (--dispatchDepth === 0) {
            listeners.forEach((fn) => fn());
          }
        }
      },
    ),
    // TODO(acrazing): add select cache feature
    select: defineAmosObject(
      'store.select',
      (selectable: Selectable, discard?: Selectable): any => {
        if (selectable instanceof Box) {
          ensure(selectable);
          return state[selectable.key];
        } else if (!('object' in selectable)) {
          return selectable(store.select);
        } else {
          const factory = selectable.object === 'selector' ? selectable.factory : selectable;
          const args = selectable.object === 'selector' ? selectable.args : [];
        }
      },
    ),
    clearBoxes: (reloadState: boolean) => {
      if (reloadState) {
        preloadedState = Object.assign(preloadedState || {}, JSON.parse(JSON.stringify(state)));
        state = {};
      }
      boxes = {};
      listeners.forEach((fn) => fn());
    },
  };
  store = enhancers.reduce((previousValue, currentValue) => currentValue(previousValue), store);
  if (typeof process === 'object' && process.env.NODE_ENV === 'development') {
    Object.freeze(store);
  }
  return store;
}
