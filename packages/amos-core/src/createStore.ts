/*
 * @since 2021-08-02 10:50:14
 * @author junbao <junbao@mymoement.com>
 */

import {
  applyEnhancers,
  Enhancer,
  isFromJS,
  isObject,
  JSONState,
  Subscribe,
  Unsubscribe,
} from 'amos-utils';
import { Action } from './action';
import { Box } from './box';
import { $amos, Dispatch, Dispatchable, isAmosObject, Select, Selectable, Snapshot } from './types';

export interface StoreOptions {
  preloadedState?: Snapshot;
  getPreloadedState?: <S>(box: Box<S>) => JSONState<S> | undefined;
}

export interface Event {
  transaction: null | Action;
  selecting: null | Selectable;
  dispatching: null | Dispatchable;
}

export interface Store {
  snapshot: () => Snapshot;
  subscribe: (fn: Subscribe) => Unsubscribe;
  broadcast: () => void;
  dispatch: Dispatch;
  select: Select;
}

export type StoreEnhancer = Enhancer<[StoreOptions], Store>;

export function createStore(...enhancers: StoreEnhancer[]): Store;
export function createStore(options: StoreOptions, ...enhancers: StoreEnhancer[]): Store;
export function createStore(...args: any[]): Store {
  const hasOptions = args.length > 0 && typeof isObject(args[0]);
  const options: StoreOptions = hasOptions ? args[0] : {};
  const enhancers: StoreEnhancer[] = hasOptions ? args.slice(1) : args;

  return applyEnhancers([options], enhancers, (options) => {
    const getPreloadedState =
      options.getPreloadedState ?? ((box) => options.preloadedState?.[box.key] as any);

    const snapshot: Snapshot = {};
    const listeners = new Set<Subscribe>();

    const ensureBox = (box: Box) => {
      if (snapshot.hasOwnProperty(box.key)) {
        return snapshot[box.key];
      }
      let boxState = box.initialState;
      const preloadedState = getPreloadedState(box);
      if (preloadedState !== void 0) {
        boxState = isFromJS(boxState) ? boxState.fromJS(preloadedState) : preloadedState;
      }
      return (snapshot[box.key] = boxState);
    };

    const store: Store = {
      snapshot: () => snapshot,
      subscribe: (fn) => {
        listeners.add(fn);
        return () => listeners.delete(fn);
      },
      broadcast: () => {
        listeners.forEach((fn) => fn());
      },
      // only accepts Dispatchable here
      dispatch: (_task: any) => {
        const task: Dispatchable = _task;
        let r: any;
        switch (task[$amos]) {
          case 'ACTION':
            r = task.factory.actor(store.dispatch, store.select, ...task.args);
            break;
          case 'MUTATION':
            r = task.mutator.apply(task.box, [ensureBox(task.box), ...task.args]);
            break;
          case 'SIGNAL':
            r = task.data;
            task.factory.listeners.forEach((value, key) => value(ensureBox(key), r));
            break;
        }
        store.broadcast();
        return r;
      },
      select: (selectable: Selectable) => {
        if (selectable instanceof Box) {
          return ensureBox(selectable);
        }
        const factory = isAmosObject(selectable, 'SELECTOR_FACTORY')
          ? selectable
          : selectable.factory;
        const args = isAmosObject(selectable, 'SELECTOR_FACTORY') ? [] : selectable.args;
        return factory.compute(store.select, ...(args as []));
      },
    };
    return store;
  });
}
