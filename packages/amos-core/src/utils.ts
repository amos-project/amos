/*
 * @since 2024-10-20 17:12:08
 * @author junbao <junbao@moego.pet>
 */

import { isAmosObject, isObject, isPlainObject, isToJSON, toArray, toType } from 'amos-utils';
import { Box } from './box';
import { Selector, SelectorFactory } from './selector';
import { Store } from './store';
import { CacheOptions } from './types';

export function stringify(data: any): string {
  if (Array.isArray(data)) {
    return '[' + data.map(stringify).join(',') + ']';
  }
  if (typeof data === 'function') {
    throw new TypeError(`Unsupported operation for function type.`);
  }
  if (isObject<object>(data)) {
    if (isToJSON(data)) {
      return stringify(data.toJSON());
    }
    if (!isPlainObject(data)) {
      throw new TypeError('Unsupported operation for non plain object type. Got ' + toType(data));
    }
    return (
      '{' +
      Object.keys(data)
        .sort()
        .map((k) => `${k}:${stringify((data as any)[k])}`)
        .join(',') +
      '}'
    );
  }
  if (typeof data === 'string') {
    return '"' + data + '"';
  }
  if (!data || typeof data.toString !== 'function') {
    return data + '';
  }
  return data.toString();
}

export function resolveCacheKey(
  store: Store,
  id: string,
  args: readonly any[],
  key: CacheOptions<any> | undefined,
): string {
  if (key) {
    if (isAmosObject<Box>(key, 'box') || isAmosObject<Selector>(key, 'selector')) {
      args = [...args, store.select(key)];
    } else if (Array.isArray(key)) {
      args = [...args, ...store.select(key)];
    } else if (isAmosObject<SelectorFactory>(key, 'selector_factory')) {
      args = toArray(store.select(key(...args)));
    } else if (typeof key === 'function') {
      args = toArray(key(store.select, ...args) as any);
    }
  }
  return id + ':' + stringify(args);
}
