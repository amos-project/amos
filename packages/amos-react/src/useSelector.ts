/*
 * @since 2020-11-04 12:43:17
 * @author acrazing <joking.young@gmail.com>
 */

import {
  Box,
  isSelectValueEqual,
  MapSelector,
  Select,
  Selectable,
  Selector,
  SelectValuePair,
} from 'amos-core';
import { isAmosObject } from 'amos-utils';
import { useCallback, useDebugValue, useLayoutEffect, useReducer, useRef } from 'react';
import { useStore } from './context';

export function useSelect(): Select {
  const [, update] = useReducer((s) => s + 1, 0);
  const store = useStore();
  const deps = useRef<SelectValuePair[]>([]);
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
    typeof process === 'object' && process.env.NODE_ENV === 'development'
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

/**
 * Get the {@link import('amos-core').Store.select} and any call to the
 * returned selector in the render will be recorded and the component
 * will re-render when the used selector's value changed.
 *
 * You can use the returned select function anywhere, including the
 * conditional or loop blocks, and also in callbacks. Only the selector
 * called in render function will trigger re-render.
 *
 * @example
 * const select = useSelector();
 * const foo = select(selectFoo());
 * if (something) {
 *   select(bar())
 * }
 * return (
 *   <div onClick={() => alert(select(baz())}>
 *     {keys.map((key) => <div>{select(selectItem(key)).title</div>}
 *   </div>
 * )
 * ```
 */
export function useSelector(): Select;
/**
 * Get the selected states according to the selectors, and rerender the
 * component when the selected states updated.
 *
 * A selector is a selectable thing, it could be one of this:
 *
 * 1. A `Box` instance
 * 2. A `Selector` which is created by `SelectorFactory`
 *
 * If the selector is a `Selector`, the selected state is its return value,
 * otherwise, when the selector is a `Box`, the selected state is the state
 * of the `Box`.
 *
 * `useSelector` accepts multiple selectors, and returns an array of the
 * selected states of the selectors.
 *
 * @example
 * ```typescript
 * const [
 *   count, // 1
 *   tripleCount, // 2
 * ] = useSelector(
 *   countBox, // A Box
 *   selectMultipleCount(3), // A Selector
 * );
 * ```
 */
export function useSelector<Rs extends Selectable[]>(...selectors: Rs): MapSelector<Rs>;
export function useSelector(...selectors: Selectable[]): any {
  const select = useSelect();
  const size = useRef(selectors.length);
  if (size.current !== selectors.length) {
    throw new Error(
      `selector size should be immutable, previous is ${size.current}, current is ${selectors.length}`,
    );
  }
  if (selectors.length === 0) {
    return select;
  }
  return select(selectors);
}
