/*
 * @since 2020-11-04 12:43:17
 * @author acrazing <joking.young@gmail.com>
 */

import { useContext, useReducer, useRef } from 'react';
import { __Context } from './context';
import { Selector } from './selector';
import { Dispatch, Selectable, Snapshot, Store } from './store';
import { arrayEqual, strictEqual } from './utils';

/**
 * use context's store
 *
 * @stable
 */
export function useStore(): Store {
  const state = useContext(__Context);
  if (!state) {
    throw new Error('[Amos] you are using hooks without <Provider />.');
  }
  return state.store;
}

export function useDispatch(): Dispatch {
  const store = useStore();
  return store.dispatch;
}

export type MapSelector<Rs extends Selectable[]> = {
  [P in keyof Rs]: Rs[P] extends Selector<infer A, infer R> ? R : never;
};

interface SelectorRef {
  selectors: Selectable[];
  deps: (unknown[] | undefined)[];
  snapshots: (Snapshot | undefined)[];
  results: unknown[];
}

const defaultSelectorRef: SelectorRef = { selectors: [], deps: [], snapshots: [], results: [] };

interface StoreRef {
  store: Store;
  disposer: () => void;
  updated: boolean;
  error: any;
}

function hasSame(master: Snapshot, slave: Snapshot) {
  for (const k in master) {
    if (master.hasOwnProperty(k) && slave.hasOwnProperty(k)) {
      return true;
    }
  }
  return false;
}

function shouldSelectorRecompute(
  selector: Selector,
  store: Store,
  deps: (unknown[] | undefined)[],
  index: number,
) {
  if (!selector.factory?.deps || !deps[index]) {
    return true;
  }
  const newDeps = selector.factory.deps(store.select, ...selector.args);
  const isEqual = arrayEqual(deps[index] || [], newDeps);
  deps[index] = newDeps;
  return !isEqual;
}

function compare(selector: Selector, a: unknown, b: unknown) {
  return selector.factory ? selector.factory.compare(a, b) : strictEqual(a, b);
}

function selectorChanged(
  old: Selectable | undefined,
  newly: Selector,
  snapshot: Snapshot | undefined,
  store: Store,
  deps: unknown[] | undefined,
) {
  if (!old || typeof old !== 'function' || !snapshot || !old.args || !newly.args) {
    return true;
  }
  if (!(old === newly || (newly.factory && newly.factory === old.factory))) {
    return true;
  }
  if (newly.factory?.deps === void 0) {
    return arrayEqual(old.args, newly.args);
  }
  if (newly.factory.deps === false) {
    return true;
  }
  const newDeps = newly.factory.deps(store.select, ...newly.args);
  const isEqual = arrayEqual(deps || [], newDeps);
  return isEqual ? false : newDeps;
}

export function useSelector<Rs extends Selectable[]>(...selectors: Rs): MapSelector<Rs> {
  const [, update] = useReducer((s) => s + 1, 0);
  const store = useStore();
  const lastSelector = useRef<SelectorRef>(defaultSelectorRef);
  const lastStore = useRef<StoreRef>();
  if (lastStore.current?.store !== store) {
    lastSelector.current = defaultSelectorRef;
    lastStore.current?.disposer();
    lastStore.current = {
      store,
      updated: false,
      error: void 0,
      disposer: store.subscribe((updatedState) => {
        let i = 0;
        const { selectors, snapshots, results, deps } = lastSelector.current;
        const max = selectors.length;
        try {
          for (; i < max; i++) {
            const selector = selectors[i];
            const snapshot = snapshots[i];
            if (typeof selector === 'function') {
              if (!snapshot || hasSame(snapshot, updatedState)) {
                if (shouldSelectorRecompute(selector, store, deps, i)) {
                  const newSnapshot: Snapshot = {};
                  const newResult = store.select(selector, newSnapshot);
                  lastStore.current!.updated ||= !compare(selector, results[i], newResult);
                  snapshots[i] = newSnapshot;
                  results[i] = newResult;
                }
              }
            } else {
              results[i] = store.select(selector);
            }
          }
          lastStore.current!.updated && update();
        } catch (e) {
          snapshots.length = results.length = i - 1;
          lastStore.current!.error =
            typeof e === 'object' && e
              ? Object.assign(e, { message: '[Amos] selector throws error: ' + e.message })
              : new Error('[Amos] selector throws falsy error: ' + e);
          update();
        }
      }),
    };
  }
  if (lastStore.current.error) {
    const error = lastStore.current.error;
    lastStore.current.error = void 0;
    throw error;
  }
  if (lastStore.current.updated) {
    lastStore.current.updated = false;
    return lastSelector.current.results as any;
  }
  if (lastSelector.current === defaultSelectorRef) {
    lastSelector.current = { selectors: [], deps: [], snapshots: [], results: [] };
  }
  // updates from outside
  const { selectors: oldSelectors, deps, snapshots, results } = lastSelector.current;
  for (let i = 0; i < selectors.length; i++) {
    const old = oldSelectors[i];
    const newly = selectors[i];
    if (typeof newly === 'object') {
      results[i] = store.select(newly);
      oldSelectors[i] = newly;
    } else {
      const newDeps = selectorChanged(old, newly, snapshots[i], store, deps[i]);
      if (newDeps) {
        snapshots[i] = void 0;
        const newSnapshot: Snapshot = {};
        results[i] = store.select(newly, newSnapshot);
        deps[i] = newDeps === true ? void 0 : newDeps;
        snapshots[i] = newSnapshot;
        oldSelectors[i] = newly;
      }
    }
  }
  results.length = selectors.length;
  return results as any;
}
