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
import { useCallback, useDebugValue, useReducer, useState } from 'react';
import { useStore } from './context';
import useIsomorphicLayoutEffect from './utils';

export interface UseSelector extends Select {
  (): Select;
}

export const useSelector: UseSelector = (selectors?: Selectable | readonly Selectable[]): any => {
  const [, update] = useReducer((s) => s + 1, 0);
  const store = useStore();
  const [state] = useState(() => ({ deps: [] as SelectEntry[], rendering: true }));
  state.deps = [];
  state.rendering = true;
  useIsomorphicLayoutEffect(() => {
    state.rendering = false;
  });
  useIsomorphicLayoutEffect(() => {
    return store.subscribe(() => {
      if (state.deps.some(([s, v]) => !isSelectValueEqual(s, v, store.select(s)))) {
        update();
      }
    });
  }, []);
  useDebugValue(state, (value) => {
    return {
      get state() {
        return value.deps.reduce(
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
      },
    };
  });

  const select = useCallback(
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

  if (!selectors) {
    return select;
  }
  return select(selectors as any);
};
