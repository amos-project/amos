/*
 * @since 2020-11-03 13:31:31
 * @author acrazing <joking.young@gmail.com>
 */

import { Action } from './action';
import { Box } from './box';
import { Event } from './event';
import { Mutation } from './mutation';
import { Selector } from './selector';
import { isArray } from './utils';

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
export type Dispatchable<R = any> = Mutation<any, [R, ...any[]]> | Action<R> | Event<R>;

/**
 * dispatch
 *
 * @stable
 */
export interface Dispatch {
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

/**
 * selectable things
 *
 * @stable
 */
export type Selectable<R = any> = Box<R> | Selector<R>;

/**
 * select
 *
 * @stable
 */
export type Select = <R>(selectable: Selectable<R>, snapshot?: Snapshot) => R;

/**
 * Store
 *
 * @stable
 */
export interface Store {
  /**
   * get the state snapshot of the store.
   *
   * Please note that any mutation of the snapshot is silent.
   */
  snapshot: () => Snapshot;
  /**
   * dispatch one or more dispatchable things.
   */
  dispatch: Dispatch;
  /**
   * subscribe the mutations
   * @param fn
   */
  subscribe: (fn: (updatedState: Snapshot) => void) => () => void;
  /**
   * select a selectable thing
   */
  select: Select;
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
  const state: Snapshot = {};
  const boxes: Box[] = [];
  const listeners: Array<(updatedSnapshot: Snapshot) => void> = [];
  const ensure = (box: Box) => {
    if (state.hasOwnProperty(box.key)) {
      return;
    }
    let boxState = box.initialState;
    if (preloadedState?.hasOwnProperty(box.key)) {
      boxState = box.preload(preloadedState[box.key], boxState);
    }
    state[box.key] = boxState;
    boxes.push(box);
  };

  let dispatchDepth = 0;
  let dispatchingSnapshot: Snapshot = {};

  const record = (key: string, newState: unknown) => {
    if (newState !== state[key] || dispatchingSnapshot.hasOwnProperty(key)) {
      dispatchingSnapshot[key] = newState;
      state[key] = newState;
    }
  };

  const exec = (dispatchable: Dispatchable) => {
    if (typeof dispatchable === 'function') {
      // it is action
      return dispatchable(store.dispatch, store.select);
    }
    if (dispatchable.object === 'mutation') {
      const {
        box,
        box: { key },
        action,
        mutator,
      } = dispatchable;
      ensure(box);
      record(key, mutator(state[key], action));
      return action;
    }
    if (dispatchable.object === 'event') {
      const { data, factory } = dispatchable;
      for (const { key, listeners } of boxes) {
        for (const [e, fn] of listeners) {
          if (e === factory) {
            record(key, fn(state[key], data));
          }
        }
      }
      return data;
    }
  };

  let selectingSnapshot: Snapshot | undefined;

  let store: Store = {
    snapshot: () => state,
    dispatch: (tasks: Dispatchable | readonly Dispatchable[]) => {
      if (++dispatchDepth === 1) {
        dispatchingSnapshot = {};
      }
      try {
        if (isArray(tasks)) {
          return tasks.map(exec);
        } else {
          return exec(tasks);
        }
      } finally {
        if (--dispatchDepth === 0) {
          if (Object.keys(dispatchingSnapshot).length > 0) {
            listeners.forEach((fn) => fn(dispatchingSnapshot));
          }
        }
      }
    },
    subscribe: (fn) => {
      listeners.push(fn);
      return () => {
        const index = listeners.indexOf(fn);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
    select: (selectable, snapshot): any => {
      if (typeof selectable === 'function') {
        if (snapshot) {
          if (selectingSnapshot) {
            throw new Error(`[Amos] recursive snapshot collection is not supported.`);
          }
          selectingSnapshot = snapshot;
          try {
            return selectable(store.select);
          } finally {
            selectingSnapshot = void 0;
          }
        } else {
          return selectable(store.select);
        }
      } else {
        ensure(selectable);
        if (selectingSnapshot) {
          selectingSnapshot[selectable.key] = state[selectable.key];
        }
        return state[selectable.key];
      }
    },
  };
  store = enhancers.reduce((previousValue, currentValue) => currentValue(previousValue), store);
  return store;
}
