/*
 * @since 2020-11-03 13:31:31
 * @author acrazing <joking.young@gmail.com>
 */

import { Action, FunctionAction } from './action';
import { Box, Mutation } from './box';
import { FunctionSelector, Selector, SelectorFactory } from './selector';
import { Signal } from './signal';
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
export type Dispatchable<R = any> = Mutation<R> | Action<any, R> | Signal<R> | FunctionAction<R>;

/**
 * base kcats signature, this is used for someone want to change the signature of useDispatch()
 *
 * @stable
 */
export interface KcatsDispatch {
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

export interface Dispatch extends KcatsDispatch {}

/**
 * selectable things
 *
 * @stable
 */
export type Selectable<R = any> =
  | Box<R>
  | FunctionSelector<R>
  | Selector<any, R>
  | SelectorFactory<[], R>;

export interface Select {
  /**
   * compute a selectable thing, cache and return its result.
   *
   * A selectable thing could be:
   *
   * - a `Box`, will not cache, and return its state directly
   * - a `FunctionSelector`, will compute and return directly
   * - a `SelectorFactory`, it will be computed without extra args
   * - a `Selector`, it will be computed with specified args
   *
   * if select a `SelectorFactory` or a `Selector`, it will be cached with
   * its cache strategy. {@see selector}
   *
   * @param selectable
   */ <A extends Selectable>(selectable: A): A extends Box<infer S>
    ? S
    : A extends SelectorFactory<[], infer R>
    ? R
    : A extends Selector<any, infer R>
    ? R
    : A extends FunctionSelector<infer R>
    ? R
    : never;
}

export type Unsubscribe = () => void;

/**
 * Store
 *
 * @stable
 */
export interface Store {
  /**
   * get the state snapshot.
   *
   * PLEASE DO NOT MUTATE IT.
   */
  snapshot: () => Snapshot;

  /**
   * dispatch a `Dispatchable`.
   */
  dispatch: Dispatch;

  /**
   * compute a `Selectable` with cache.
   */
  select: Select;

  /**
   * subscribe the state update event, it will be triggered when a `Dispatchable` is dispatched.
   * Please note it will only be triggered once even if a `Dispatchable` mutated the state
   * multiple times.
   *
   * In most cases, especially when used in React, you don't need to call this method.
   *
   * @param fn
   */
  subscribe: (fn: () => void) => Unsubscribe;

  /**
   * clean up internal state, including:
   *
   * - the box instances
   * - the selector caches
   * - the state objects (convert to JSON as preloaded state)
   *
   * This allows you to reset the internal state when using HMR.
   */
  resetInternalState: () => void;
}

export type StoreEnhancer = (store: Store) => Store;

/**
 * create a store
 * @param preloadedState
 * @param enhancers
 *
 * @stable
 */
export function createStore(preloadedState: Snapshot = {}, ...enhancers: StoreEnhancer[]): Store {
  let state: Snapshot = {};
  let boxes: Record<string, Box> = {};
  let boxRefs: Record<string, Record<string, true>> = {};
  let selectorRefs: Record<string, Record<string, true>> = {};
  let selectorCaches: Record<string, unknown> = {};

  const listeners: Array<() => void> = [];

  function ensureBox(box: Box) {
    if (!boxes.hasOwnProperty(box.key)) {
      boxes[box.key] = box;
    }
    if (state.hasOwnProperty(box.key)) {
      return state[box.key];
    }
    let boxState = box.initialState;
    if (preloadedState.hasOwnProperty(box.key)) {
      boxState = box.preload(preloadedState[box.key], boxState);
    }
    return (state[box.key] = boxState);
  }

  function selectorKey(factory: SelectorFactory, args: unknown[]) {
    if (typeof factory.cacheStrategy === 'boolean') {
      return `${factory.id}.${args.join(',')}`;
    } else {
      return `${factory.id}.${factory.cacheStrategy(...args)}`;
    }
  }

  function dropCache(key: string) {
    delete selectorCaches[key];
    const refs = selectorRefs[key];
    if (!refs) {
      return;
    }
    delete selectorRefs[key];
    for (const dk in refs) {
      dropCache(dk);
    }
  }

  function dropRef(key: string) {
    if (!boxRefs[key]) {
      return;
    }
    const refs = boxRefs[key];
    delete boxRefs[key];
    for (const sk in refs) {
      dropCache(sk);
    }
  }

  let dispatching: Dispatchable | readonly Dispatchable[] | undefined;
  let updatedKeys: Record<string, true> = {};
  const selecting: string[] = [];

  const exec = (dispatchable: Dispatchable) => {
    if (typeof dispatchable === 'function') {
      return dispatchable();
    }
    switch (dispatchable.$object) {
      case 'action':
        return dispatchable.factory.actor(store.dispatch, store.select, ...dispatchable.args);
      case 'mutation':
        ensureBox(dispatchable.factory.box);
        const key = dispatchable.factory.box.key;
        const nextState = dispatchable.factory.mutator(state[key], ...dispatchable.args);
        if (nextState !== state[key]) {
          updatedKeys[key] = true;
          state[key] = nextState;
          dropRef(key);
        }
        return nextState;
      case 'signal':
        for (const key in boxes) {
          if (!boxes.hasOwnProperty(key)) {
            continue;
          }
          const box = boxes[key];
          const fn = box.signalSubscribers[dispatchable.type];
          if (!fn) {
            continue;
          }
          const nextState = fn(state[box.key], dispatchable.data);
          if (nextState !== state[key]) {
            updatedKeys[key] = true;
            state[key] = nextState;
            dropRef(key);
          }
        }
        return dispatchable.data;
      default:
        throw new TypeError(`dispatching non-dispatchable object: ${dispatchable['$object']}`);
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
    dispatch: (tasks: Dispatchable | readonly Dispatchable[]) => {
      const isRoot = !dispatching;
      dispatching ||= tasks;
      try {
        if (isArray(tasks)) {
          return tasks.map(exec);
        } else {
          return exec(tasks);
        }
      } finally {
        if (isRoot) {
          dispatching = void 0;
          listeners.forEach((fn) => fn());
        }
      }
    },
    select: ((selectable: Selectable) => {
      if (typeof selectable === 'function' && !('$object' in selectable)) {
        return selectable(store.select);
      }
      const parentKey = selecting[selecting.length - 1];
      if (selectable instanceof Box) {
        const boxState = ensureBox(selectable);
        if (parentKey) {
          (boxRefs[selectable.key] ||= {})[parentKey] = true;
        }
        return boxState;
      }
      const args = selectable.$object === 'selector_factory' ? [] : selectable.args;
      const factory = selectable.$object === 'selector_factory' ? selectable : selectable.factory;
      if (!factory.cacheStrategy) {
        return factory.compute(store.select, ...args);
      }
      try {
        const currentKey = selectorKey(factory, args);
        selecting.push(currentKey);
        if (!(currentKey in selectorCaches)) {
          selectorCaches[currentKey] = factory.compute(store.select, ...args);
        }
        if (parentKey) {
          (selectorRefs[currentKey] ||= {})[parentKey] = true;
        }
        return selectorCaches[currentKey];
      } finally {
        selecting.pop();
      }
    }) as Select,
    resetInternalState: () => {
      preloadedState = Object.assign(preloadedState || {}, JSON.parse(JSON.stringify(state)));
      state = {};
      boxes = {};
      boxRefs = {};
      selectorRefs = {};
      selectorCaches = {};
      listeners.forEach((fn) => fn());
    },
  };
  return enhancers.reduce((previousValue, currentValue) => currentValue(previousValue), store);
}
