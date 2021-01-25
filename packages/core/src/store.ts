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
export interface Select {
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
  snapshot: () => Snapshot;
  dispatch: Dispatch;
  select: Select;
  subscribe: (fn: () => void) => Unsubscribe;
  clear: (reloadState: boolean) => void;
}

export type StoreEnhancer = (store: Store) => Store;

interface CacheNode<T = unknown> {
  value: T | undefined;
  dependents: Set<CacheNode>;
  children: Map<unknown, CacheNode>;
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
      cacheTree.set(factory, { dependents: new Set(), children: new Map(), value: void 0 });
    }
    let node = cacheTree.get(factory)!;
    for (const argv of args) {
      if (!node.children.has(argv)) {
        node.children.set(argv, { dependents: new Set(), children: new Map(), value: void 0 });
      }
      node = node.children.get(argv)!;
    }
    return node;
  }

  function revokeCache(node: CacheNode) {
    if (node.value === void 0) {
      // avoid circle reference
      return;
    }
    node.value = void 0;
    for (const dep of node.dependents) {
      revokeCache(dep);
    }
    node.dependents.clear();
  }

  let dispatching: Dispatchable | readonly Dispatchable[] | undefined;
  let selecting: CacheNode | undefined;
  let updatedKeys: Record<string, true> = {};

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
          for (const key in updatedKeys) {
            if (updatedKeys.hasOwnProperty(key) && boxRefs.hasOwnProperty(key)) {
              for (const node of boxRefs[key]) {
                revokeCache(node);
              }
              boxRefs[key].clear();
            }
          }
        }
      }
    },
    select: ((selectable: Selectable) => {
      if (typeof selectable === 'function' && !('$object' in selectable)) {
        return selectable(store.select);
      }
      if (selectable instanceof Box) {
        const boxState = ensureBox(selectable);
        if (selecting) {
          (boxRefs[selectable.key] ||= new Set()).add(selecting);
        }
        return boxState;
      }
      const args = selectable.$object === 'selector_factory' ? [] : selectable.args;
      const factory = selectable.$object === 'selector_factory' ? selectable : selectable.factory;
      if (!factory.needCache) {
        return factory.compute(store.select, ...args);
      }
      const cacheNode = ensureCache(factory, args);
      const isRoot = !selecting;
      selecting ||= cacheNode;
      try {
        if (cacheNode.value === void 0) {
          cacheNode.value = factory.compute(store.select, ...args);
        }
        if (!isRoot) {
          cacheNode.dependents.add(selecting);
        }
        return cacheNode.value;
      } finally {
        if (isRoot) {
          selecting = void 0;
        }
      }
    }) as Select,
    clear: (reloadState) => {
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
