/*
 * @since 2020-11-04 11:12:36
 * @author acrazing <joking.young@gmail.com>
 */

import { ValueOrConstructor, ValueOrFunc } from './types';

export function resolveCallerName(depth = 2) {
  if (process.env.NODE_ENV !== 'development') {
    return '';
  }
  try {
    let caller: Function = resolveCallerName;
    while (depth-- > 0) {
      caller = caller.caller;
    }
    const factory = caller.caller.toString();
    const index = factory.indexOf(caller.toString());
    if (index > -1) {
      return factory.substring(0, index).match(/([a-z0-9$_]+)\s*=[^=]*$/)?.[1] || '';
    }
    return '';
  } catch {
    return '';
  }
}

export function warning(shouldWarning: boolean, message: string) {
  if (shouldWarning) {
    console.error('Warning: [Amos] ' + message);
  }
}

export function must<T>(value: T, message: string): asserts value {
  if (!value) {
    const err = new Error(message);
    err.name = 'AmosError';
    throw err;
  }
}

export const ANY: any = void 0;

export function resolveCtorValue<V>(value: ValueOrConstructor<V>): V {
  return typeof value === 'function' ? new (value as any)() : value;
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
  if (items && (items as any)[Symbol.iterator]) {
    return Array.from(items as Iterable<T>);
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

export function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

export function toType(s: unknown) {
  if (s == null) {
    return s + '';
  }
  if (typeof s.constructor === 'function') {
    return s.constructor.name;
  }
  return Object.prototype.toString.call(s);
}

export function toString(s: unknown) {
  if (s == null) {
    return s + '';
  }
  if (typeof s.toString === 'function') {
    return s.toString();
  }
  return toType(s);
}
