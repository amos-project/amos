/*
 * @since 2020-11-15 15:43:49
 * @author acrazing <joking.young@gmail.com>
 */

import {
  Dispatchable,
  hoistMethod,
  Selectable,
  SelectorFactory,
  Snapshot,
  StoreEnhancer,
} from '@kcats/core';
import { Action, Store as ReduxStore } from 'redux';

declare module '@kcats/core' {
  export interface Select {
    <R>(
      hybridSelector: Selectable<R> | ((state: any, ...args: any[]) => R),
      snapshot?: Snapshot,
    ): R;
    getState: () => Snapshot;
    [P: string]: any;
  }

  export interface Dispatch {
    <A extends Action>(action: A): A extends Dispatchable<infer R> ? R : A;
  }

  export type ReduxSelectable<R = any> = ((state: any) => R) | Selectable<R>;

  export type MapReduxSelector<Rs extends readonly Selectable[]> = {
    [P in keyof Rs]: Rs[P] extends SelectorFactory<infer A, infer R>
      ? R
      : Rs[P] extends ReduxSelectable<infer R>
      ? R
      : never;
  };

  export function useSelector<Rs extends ReduxSelectable[]>(...selectors: Rs): MapReduxSelector<Rs>;
}

export function withRedux(reduxStore: ReduxStore): StoreEnhancer {
  return (store) => {
    const { dispatch, subscribe, select, snapshot } = store;
    // capture listeners to send notification when redux state update
    const listeners: Array<(s: Snapshot) => void> = [];
    // redux state snapshot
    let reduxState: Snapshot;
    // kcats state snapshot
    const kcatsState: Snapshot = store.snapshot();
    // capture selecting snapshot to merge redux state
    let selectingSnapshot: Snapshot | undefined;
    store.dispatch = hoistMethod(dispatch, (task: any) => {
      if (Array.isArray(task)) {
        return dispatch(task);
      }
      switch (task.object) {
        case 'mutation':
        case 'action':
        case 'signal':
          return dispatch(task);
        default:
          return reduxStore.dispatch(task);
      }
    });
    store.subscribe = hoistMethod(subscribe, (fn) => {
      const dispose = subscribe(fn);
      listeners.push(fn);
      return () => {
        const index = listeners.indexOf(fn);
        index !== -1 && listeners.splice(index, 1);
        dispose();
      };
    });
    store.select = hoistMethod(select, (selectable: any, snapshot?: any) => {
      if (snapshot) {
        selectingSnapshot = snapshot;
      }
      try {
        return select(selectable, snapshot);
      } finally {
        if (snapshot) {
          selectingSnapshot = void 0;
        }
      }
    });
    Object.defineProperty(store.select, 'getState', {
      value: () => reduxStore.getState(),
    });
    const syncState = () => {
      const nextReduxState: Snapshot = reduxStore.getState();
      if (nextReduxState !== reduxState) {
        reduxState = nextReduxState;
        const updatedState = Object.keys(nextReduxState).reduce((previousValue, currentValue) => {
          const sliceKey = `${currentValue}_from_redux$`;
          if (kcatsState[sliceKey] !== nextReduxState[currentValue]) {
            previousValue[sliceKey] = kcatsState[sliceKey] = nextReduxState[currentValue];
          }
          if (!store.select.hasOwnProperty(currentValue)) {
            Object.defineProperty(store.select, currentValue, {
              get: () => {
                const state = reduxStore.getState()[currentValue];
                if (selectingSnapshot) {
                  selectingSnapshot[sliceKey] = state;
                }
                return state;
              },
            });
          }
          return previousValue;
        }, {} as Snapshot);
        listeners.forEach((fn) => fn(updatedState));
      }
    };
    syncState();
    store.snapshot = hoistMethod(snapshot, () => {
      syncState();
      return snapshot();
    });
    reduxStore.subscribe(syncState);
    return store;
  };
}
