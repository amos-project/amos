/*
 * @since 2022-02-18 00:04:50
 * @author acrazing <joking.young@gmail.com>
 */

import { Entry, isAmosObject, override } from 'amos-utils';
import { Box } from '../box';
import { Selector } from '../selector';
import { StoreEnhancer } from '../store';
import { Selectable } from '../types';
import { resolveCacheKey } from '../utils';

export type SelectEntry<R = any> = Entry<Selectable<R>, R>;

export function isSelectValueEqual<R>(s: Selectable<R>, a: R, b: R) {
  if (!isAmosObject<Selector>(s, 'selector') || s.cache) {
    return a === b;
  }
  return s.equal(a, b);
}

export const withCache: () => StoreEnhancer = () => {
  return (next) => (options) => {
    const store = next(options);
    const cacheMap = new Map<string, readonly [id: string, value: any, deps: SelectEntry[]]>();
    const stack = new Array<SelectEntry[] | null>();
    const peak = () => stack[stack.length - 1];
    override(store, 'select', (select) => {
      return (s: any) => {
        const isSelector = isAmosObject<Selector>(s, 'selector');
        const isBox = isAmosObject<Box>(s, 'box');
        if (!isSelector && !isBox) {
          return select(s);
        }
        const parent = peak();
        if (!isSelector || !s.cache) {
          parent && stack.push(null);
          try {
            const v = select(s);
            parent?.push([s, v]);
            return v;
          } finally {
            parent && stack.pop();
          }
        }
        // should check the cache now
        const key = resolveCacheKey(store.select, s, void 0);
        let cache = cacheMap.get(key);
        if (cache && cache[0] !== s.id) {
          cacheMap.delete(key);
          cache = void 0;
        }
        if (cache) {
          try {
            // make sure the cache compute is not collected to the deps
            stack.push(null);
            if (cache[2].every(([s, v]) => isSelectValueEqual(s, v, store.select(s)))) {
              parent?.push([s, cache[1]]);
              return cache[1];
            } else {
              cacheMap.delete(key);
            }
          } finally {
            stack.pop();
          }
        }
        stack.push([]);
        try {
          let v = select(s);
          if (cache && s.equal(cache[1], v)) {
            v = cache[1];
          }
          parent?.push([s, v]);
          cacheMap.set(key, [s.id, v, peak()!]);
          return v;
        } finally {
          stack.pop();
        }
      };
    });
    return store;
  };
};
