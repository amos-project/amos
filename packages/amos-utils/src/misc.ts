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

export interface NextTicker<T, R> {
  (...items: T[]): void;
  wait(...items: T[]): Promise<R>;
}

export function nextSerialTicker<T, R>(
  fn: (items: T[]) => Promise<R>,
  onError: (e: unknown) => void,
): NextTicker<T, R> {
  let pending: T[] | undefined = void 0;
  let p: Promise<void> | undefined = void 0;
  let dp: Defer<R> | undefined = void 0;
  const run = () => {
    if (p || pending === void 0) {
      return;
    }
    p = Promise.resolve().then(async () => {
      const items = pending!;
      const _w = dp;
      dp = void 0;
      pending = void 0;
      try {
        const r = await fn(items);
        _w?.resolve(r);
      } catch (e) {
        onError(e);
        _w?.reject(e);
      } finally {
        p = void 0;
        run();
      }
    });
  };

  function ticker(...items: T[]) {
    if (pending) {
      pending.push(...items);
    } else {
      pending = items;
      run();
    }
  }

  ticker.wait = function (...items: T[]) {
    ticker(...items);
    return (dp ??= defer<R>());
  };
  return ticker;
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

export function noop() {}

export interface Defer<T> extends Promise<T> {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
  exec: (fn: () => PromiseLike<T> | T) => this;
}

export function defer<T = void>(): Defer<T> {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: any) => void;
  const p = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return Object.assign(p, {
    resolve: resolve!,
    reject: reject!,
    exec: (fn: () => PromiseLike<T> | T) => {
      try {
        resolve(fn());
      } catch (e) {
        reject(e);
      }
      return p as Defer<T>;
    },
  });
}

export class NotImplemented extends Error {
  constructor() {
    super('not implemented');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// make sure there is no async block
export function tryFinally(_try: () => undefined, _finally: () => undefined) {
  try {
    _try();
  } finally {
    _finally();
  }
}
