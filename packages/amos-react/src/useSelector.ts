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
import { useCallback, useDebugValue, useLayoutEffect, useReducer, useRef } from 'react';
import { useStore } from './context';

function useSelect(): Select {
  const [, update] = useReducer((s) => s + 1, 0);
  const store = useStore();
  const deps = useRef<SelectEntry[]>([]);
  const rendering = useRef(true);
  rendering.current = true;
  deps.current = [];
  useLayoutEffect(() => {
    rendering.current = false;
  });
  useLayoutEffect(() => {
    return store.subscribe(() => {
      if (deps.current.some(([s, v]) => !isSelectValueEqual(s, v, store.select(s)))) {
        update();
      }
    });
  }, []);
  useDebugValue(
    deps.current,
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
              if (map.hasOwnProperty(type)) {
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
      if (!rendering.current) {
        return value;
      }
      if (Array.isArray(selectable)) {
        deps.current.push(...selectable.map((s, i) => [s, value[i]] as const));
      } else {
        deps.current.push([selectable, value]);
      }
      return value;
    },
    [store, rendering, deps],
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
