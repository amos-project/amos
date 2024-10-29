/*
 * @since 2020-11-04 11:12:36
 * @author acrazing <joking.young@gmail.com>
 */

import { isIterable } from './equals';
import { ValueOrConstructor, ValueOrFunc } from './types';

export function must<T>(value: T, message: string): asserts value {
  if (!value) {
    const err = new Error(message);
    err.name = 'AmosError';
    throw err;
  }
}

export const ANY: any = void 0;

export function resolveConstructorValue<V, A extends any[]>(
  value: ValueOrConstructor<V, A>,
  ...args: A
): V {
  return typeof value === 'function' ? new (value as any)(...args) : value;
}

export function toFunc<V, A extends any[]>(value: ValueOrFunc<V, A>): (...args: A) => V {
  return typeof value === 'function' ? (value as any) : () => value;
}

export function resolveFuncValue<V, A extends any[]>(value: ValueOrFunc<V, A>, ...args: A): V {
  return toFunc(value)(...args);
}

export function removeElement<T>(input: T[], ...items: T[]) {
  for (const item of items) {
    const index = input.indexOf(item);
    if (index > -1) {
      input.splice(index, 1);
    }
  }
  return input;
}

export function toArray<T>(items: T[] | Iterable<T> | T): T[] {
  if (Array.isArray(items)) {
    return items;
  }
  if (isIterable(items)) {
    return Array.from(items);
  }
  return [items as T];
}

export function nextTick(fn: () => void) {
  Promise.resolve().then(fn);
}

export interface NextTicker<T> {
  (...items: T[]): void;
}

export function nextTicker<T>(fn: (items: T[]) => void): NextTicker<T> {
  let pending: T[] = [];
  return (...items: T[]) => {
    if (pending.length === 0) {
      nextTick(() => {
        const items = pending;
        pending = [];
        fn(items);
      });
    }
    pending.push(...items);
  };
}

export function toType(s: unknown) {
  if (s == null) {
    return s + '';
  }
  const typ = typeof s;
  if (typ !== 'object') {
    return typ;
  }
  if (typeof s.constructor === 'function') {
    return s.constructor.name;
  }
  return Object.prototype.toString.call(s);
}

export const __DEV__ = typeof process === 'object' && process.env.NODE_ENV === 'development';
export const __TEST__ = __DEV__ && typeof jest !== 'undefined';

export function noop() {}

export function defer<T = void>() {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: any) => void;
  const p = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return Object.assign(p, {
    resolve: resolve!,
    reject: reject!,
    exec: async (fn: () => PromiseLike<T> | T) => {
      resolve(fn());
      return p;
    },
  });
}

export class NotImplemented extends Error {
  constructor() {
    super('not implemented');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
