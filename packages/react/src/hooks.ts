/*
 * @since 2020-11-04 12:43:17
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, Dispatch, identity, Selectable, Store } from '@kcats/core';
import { useContext, useDebugValue, useEffect, useReducer, useRef } from 'react';
import { __Context } from './context';

/**
 * use context's store
 *
 * @stable
 */
export function useStore(): Store {
  const state = useContext(__Context);
  if (!state) {
    throw new Error('[Kcats] you are using hooks without <Provider />.');
  }
  return state;
}

export function useDispatch(): Dispatch {
  const store = useStore();
  return store.dispatch;
}

export type MapSelector<Rs extends readonly Selectable[]> = {
  [P in keyof Rs]: Rs[P] extends Selectable<infer R> ? R : never;
};

interface StoreRef {
  store: Store;
  dispose: () => void;
  error: any;
}

function isEqual(selector: Selectable, results: unknown[], index: number, current: unknown) {
  if (results.length <= index) {
    return false;
  }
  return '$object' in selector
    ? selector.$object === 'selector'
      ? selector.factory.equalFn(results[index], current)
      : selector.equalFn(results[index], current)
    : results[index] === current;
}

/**
 * Get the selected states according to the selectors, and rerender the
 * component when the selected states updated.
 *
 * A selector is a selectable thing, it could be one of this:
 *
 * 1. A pure function accepts `store.select` as the only one parameter
 * 2. A `Selector` which is created by `SelectorFactory`
 * 3. A `Box` instance
 *
 * If the selector is a function or a `Selector`, the selected state is its
 * return value, otherwise, when the selector is a `Box`, the selected state is
 * the state of the `Box`.
 *
 * `useSelector` accepts multiple selectors, and returns an array of the
 * selected states of the selectors.
 *
 * @example
 * ```typescript
 * const [
 *   count, // 1
 *   doubleCount, // 2
 *   tripleCount, // 3
 * ] = useSelector(
 *   countBox, // A Box
 *   selectDoubleCount, // A pure function
 *   selectMultipleCount(3), // A Selector
 * );
 * ```
 *
 * @param selectors a selectable array
 */
export function useSelector<Rs extends Selectable[]>(...selectors: Rs): MapSelector<Rs> {
  const [, update] = useReducer((s) => s + 1, 0);
  const store = useStore();
  const lastSelectors = useRef<Selectable[]>([]);
  const lastResults = useRef<MapSelector<Rs>>([] as any);
  const lastStore = useRef<StoreRef>(void 0 as any);
  if (lastStore.current?.store !== store) {
    lastStore.current?.dispose();
    lastStore.current = {
      store,
      error: void 0,
      dispose: store.subscribe(() => {
        try {
          for (let i = 0; i < lastSelectors.current.length; i++) {
            const selector = lastSelectors.current[i];
            if (!isEqual(selector, lastResults.current, i, store.select(selector))) {
              update();
              return;
            }
          }
        } catch (e) {
          lastStore.current.error =
            typeof e === 'object' && e
              ? Object.assign(e, { message: '[Kcats] selector throws error: ' + e.message })
              : new Error('[Kcats] selector throws falsy error: ' + e);
          update();
        }
      }),
    };
  }
  useEffect(
    () => () => {
      lastStore.current?.dispose();
    },
    [],
  );
  if (lastStore.current.error) {
    const error = lastStore.current.error;
    lastStore.current.error = void 0;
    throw error;
  }
  try {
    lastSelectors.current = selectors;
    lastResults.current = selectors.map((s) => store.select(s)) as any;
  } catch (e) {
    lastResults.current = [] as any;
    throw e;
  }
  useDebugValue(
    lastResults.current,
    typeof process === 'object' && process.env.NODE_ENV === 'development'
      ? (value: any[]) => {
          return value.reduce((map, value, index) => {
            const s = selectors[index];
            let type =
              s instanceof Box
                ? s.key
                : '$object' in s
                ? s.$object === 'selector'
                  ? s.factory.type
                  : s.type
                : s.type || s.name;
            if (!type) {
              type = `anonymous`;
            }
            if (map.hasOwnProperty(type)) {
              type = type + '_' + index;
            }
            map[type] = value;
            return map;
          }, {} as any);
        }
      : identity,
  );
  return lastResults.current;
}
