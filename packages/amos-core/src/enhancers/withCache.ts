/*
 * @since 2022-02-18 00:04:50
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, Selectable, Selector } from 'amos-core';
import { Entry, isAmosObject, override } from 'amos-utils';
import { StoreEnhancer } from '../store';
import { resolveCacheKey } from '../utils';

export type SelectValueEntry<R = any> = Entry<Selectable<R>, R>;

export function isSelectValueEqual<R>(s: Selectable<R>, a: R, b: R) {
  if (!isAmosObject<Selector>(s, 'selector') || s.cache) {
    return a === b;
  }
  return s.equal(a, b);
}

export const withCache: () => StoreEnhancer = () => {
  return (next) => (options) => {
    const store = next(options);
    const cacheMap = new Map<string, readonly [value: any, deps: readonly SelectValueEntry[]]>();
    const stack: Array<SelectValueEntry[] | null> = [];
    const peak = () => stack[stack.length - 1];
    override(store, 'select', (select) => {
      return (s: any) => {
        const isSelector = isAmosObject<Selector>(s, 'selector');
        const isBox = isAmosObject<Box>(s, 'box');
        if (!isSelector && !isBox) {
          return select(s);
        }
        if (!isSelector || !s.cache) {
          const deps = peak();
          deps && stack.push(null);
          try {
            const v = select(s);
            deps?.push([s, v]);
            return v;
          } finally {
            deps && stack.pop();
          }
        }
        // should check the cache now
        const key = resolveCacheKey(store, s.id, s.args, void 0);
        const cache = cacheMap.get(key);
        if (cache) {
          if (cache[1].every(([s, v]) => isSelectValueEqual(s, v, store.select(v)))) {
            return cache[0];
          }
        }
        stack.push([]);
        try {
          let v = select(s);
          if (cache && isSelectValueEqual(s, cache[0], v)) {
            v = cache[0];
          }
          cacheMap.set(key, [v, peak()!]);
          return v;
        } finally {
          stack.pop();
        }
      };
    });
    return store;
  };
};
