/*
 * @since 2020-11-04 12:43:17
 * @author acrazing <joking.young@gmail.com>
 */

import {
  Box,
  isAmosObject,
  isSelectValueEqual,
  Select,
  Selectable,
  SelectEntry,
  Selector,
} from 'amos';
import { __DEV__ } from 'amos-utils';
import { useCallback, useDebugValue, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { useStore } from './context';

function useSelect(): Select {
  const [, update] = useReducer((s) => s + 1, 0);
  const store = useStore();
  const [state] = useState(() => ({
    deps: [] as SelectEntry[],
    rendering: true,
  }));
  state.deps = [];
  state.rendering = true;
  useLayoutEffect(() => {
    state.rendering = false;
  });
  useLayoutEffect(() => {
    return store.subscribe(() => {
      if (state.deps.some(([s, v]) => !isSelectValueEqual(s, v, store.select(s)))) {
        state.deps = [];
        update();
      }
    });
  }, []);
  useDebugValue(
    state.deps,
    __DEV__
      ? (value) => {
          return value.reduce(
            (map, [selectable, value], index) => {
              let type =
                (isAmosObject<Box>(selectable, 'box')
                  ? selectable.key
                  : isAmosObject<Selector>(selectable, 'selector')
                    ? selectable.type
                    : '') || 'anonymous';
              if (Object.hasOwn(map, type)) {
                type = type + '_' + index;
              }
              map[type] = value;
              return map;
            },
            {} as Record<string, any>,
          );
        }
      : void 0,
  );
  return useCallback(
    (selectable: any) => {
      const value: any = store.select(selectable);
      if (!state.rendering) {
        return value;
      }
      if (Array.isArray(selectable)) {
        state.deps.push(...selectable.map((s, i) => [s, value[i]] as const));
      } else {
        state.deps.push([selectable, value]);
      }
      return value;
    },
    [store, state],
  );
}

export interface UseSelector extends Select {
  (): Select;
}

export const useSelector: UseSelector = (selectors?: Selectable | readonly Selectable[]): any => {
  const select = useSelect();
  const size = Array.isArray(selectors) ? selectors.length : selectors === void 0 ? -2 : -1;
  const sizeRef = useRef(size);
  if (sizeRef.current !== size) {
    throw new Error(
      `selector size should be immutable, previous is ${sizeRef.current}, current is ${size}`,
    );
  }
  if (!selectors) {
    return select;
  }
  return select(selectors as any);
};
