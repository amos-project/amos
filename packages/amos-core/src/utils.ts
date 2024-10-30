/*
 * @since 2024-10-20 17:12:08
 * @author junbao <junbao@moego.pet>
 */

import {
  __DEV__,
  isAmosObject,
  isObject,
  isPlainObject,
  isToJSON,
  toArray,
  toType,
} from 'amos-utils';
import { Action } from './action';
import { Box } from './box';
import { Selector, SelectorFactory } from './selector';
import { CacheOptions, type Select } from './types';

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
  select: Select,
  v: Action | Selector,
  key: CacheOptions<any> | undefined,
): string {
  let args = v.args;
  if (key) {
    if (isAmosObject<Box>(key, 'box') || isAmosObject<Selector>(key, 'selector')) {
      args = [...args, select(key)];
    } else if (Array.isArray(key)) {
      args = [...args, ...select(key)];
    } else if (isAmosObject<SelectorFactory>(key, 'selector_factory')) {
      args = toArray(select(key(...args)));
    } else if (typeof key === 'function') {
      args = toArray(key(select, ...args) as any);
    }
  }
  const ck = v.id + ':' + stringify(args);
  if (__DEV__) {
    return v.type + ':' + ck;
  }
  return ck;
}
