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
export type Dispatchable<R = any> = Mutation | Action<any, R> | Signal<R> | FunctionAction<R>;

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
   */
  <A extends Selectable>(selectable: A): A extends Box<infer S>
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
   * - the caches
   *
   * This allows you to reset the internal state when use HMR.
   *
   * @param reloadState if true, will clean up state also, which means snapshot will be
   *                    serialized and parsed by JSON.
   */
  resetInternalState: (reloadState: boolean) => void;
}

export type StoreEnhancer = (store: Store) => Store;

const initialValue = { '@@initial': true };

interface CacheNode<T = unknown> {
  value: T | typeof initialValue;
  deps: Set<string>;
  dependents: Set<CacheNode>;
  children: Map<unknown, CacheNode>;
}

function createCacheNode(): CacheNode {
  return {
    value: initialValue,
    deps: new Set<string>(),
    dependents: new Set<CacheNode>(),
    children: new Map<unknown, CacheNode>(),
  };
}

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
  let boxRefs: Record<string, Set<CacheNode>> = {};
  let cacheTree: Map<SelectorFactory, CacheNode> = new Map<SelectorFactory, CacheNode>();
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

  function ensureCache(factory: SelectorFactory, args: unknown[]) {
    if (!cacheTree.has(factory)) {
      cacheTree.set(factory, createCacheNode());
    }
    let node = cacheTree.get(factory)!;
    for (const argv of args) {
      if (!node.children.has(argv)) {
        node.children.set(argv, createCacheNode());
      }
      node = node.children.get(argv)!;
    }
    return node;
  }

  function dropCache(node: CacheNode) {
    if (node.value === initialValue) {
      return;
    }
    node.value = initialValue;
    for (const key of node.deps) {
      boxRefs[key]?.delete(node);
    }
    for (const dep of node.dependents) {
      dropCache(dep);
    }
    node.dependents.clear();
  }

  function dropRef(key: string) {
    if (!boxRefs[key]) {
      return;
    }
    const refs = boxRefs[key];
    delete boxRefs[key];
    for (const node of refs) {
      dropCache(node);
    }
    refs.clear();
    boxRefs[key] = refs;
  }

  let dispatching: Dispatchable | readonly Dispatchable[] | undefined;
  let updatedKeys: Record<string, true> = {};
  const selecting: CacheNode[] = [];

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
        return void 0;
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
      const parent = selecting[selecting.length - 1];
      if (selectable instanceof Box) {
        const boxState = ensureBox(selectable);
        if (parent) {
          (boxRefs[selectable.key] ||= new Set()).add(parent);
          parent.deps.add(selectable.key);
        }
        return boxState;
      }
      const args = selectable.$object === 'selector_factory' ? [] : selectable.args;
      const factory = selectable.$object === 'selector_factory' ? selectable : selectable.factory;
      if (!factory.needCache) {
        return factory.compute(store.select, ...args);
      }
      try {
        const cacheNode = ensureCache(factory, args);
        selecting.push(cacheNode);
        if (cacheNode.value === initialValue) {
          cacheNode.value = factory.compute(store.select, ...args);
        }
        if (parent) {
          cacheNode.dependents.add(parent);
        }
        return cacheNode.value;
      } finally {
        selecting.pop();
      }
    }) as Select,
    resetInternalState: (reloadState) => {
      if (reloadState) {
        preloadedState = Object.assign(preloadedState || {}, JSON.parse(JSON.stringify(state)));
        state = {};
        boxRefs = {};
        cacheTree = new Map();
      }
      boxes = {};
      listeners.forEach((fn) => fn());
    },
  };
  return enhancers.reduce((previousValue, currentValue) => currentValue(previousValue), store);
}
