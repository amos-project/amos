/*
 * @since 2020-11-04 11:12:36
 * @author acrazing <joking.young@gmail.com>
 */

import { JSONSerializable, JSONState } from './types';

export function resolveCallerName() {
  try {
    const caller = resolveCallerName.caller.caller;
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

/**
 * Returns the first argument
 * @param v
 */
export const identity = <T>(v: T) => v;

/**
 * Check two objects is shallow equal or not
 * @param a
 * @param b
 */
export function shallowEqual<T extends object>(a: T, b: T): boolean {
  if (a === b) {
    return true;
  }
  const ka = Object.keys(a) as Array<keyof T>;
  if (ka.length !== Object.keys(b).length) {
    return false;
  }
  for (let i = 0; i < ka.length; i++) {
    if (!b.hasOwnProperty(ka[i]) || a[ka[i]] !== b[ka[i]]) {
      return false;
    }
  }
  return true;
}

export function conj(...args: any[]) {
  return args.join('-');
}

export function conj1(arg0: any, ...args: any[]) {
  return conj(...args);
}

export function strictEqual<T>(a: T, b: T) {
  return a === b;
}

/**
 * Check two array is shallow equal or not
 * @param a
 * @param b
 */
export function arrayEqual<T extends ArrayLike<any>>(a: T, b: T) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

export function values<T extends object>(o: T): T[keyof T][] {
  return Object.keys(o).map((k) => o[k as keyof T]);
}

export const isArray: (args: any) => args is any[] | readonly any[] = Array.isArray;

export function warning(shouldWarning: boolean, message: string) {
  if (shouldWarning) {
    console.error('Warning: [Amos] ' + message);
  }
}

export function threw(shouldThrow: boolean, message: string): asserts shouldThrow is false {
  if (shouldThrow) {
    const err = new Error(message);
    err.name = 'AmosError';
    throw err;
  }
}

/**
 * copy an object with prototype and override properties.
 *
 * @param obj - the object to be cloned.
 * @param props - the properties to override.
 */
export function clone<T>(obj: T, props: Partial<T>): T {
  if (process.env.NODE_ENV === 'development') {
    threw(typeof obj !== 'object' || !obj, `primitive object cannot be cloned.`);
    for (const key in obj) {
      if ((obj as any).hasOwnProperty(key)) {
        const value = obj[key];
        warning(
          typeof value === 'function' && !value.prototype,
          `Bound function ${key} is detected, and it may not be cloned properly.`,
        );
      }
    }
  }
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj, props);
}

export function applyEnhancers<M>(model: M, enhancers: Array<(prev: M) => M>): M {
  return enhancers.reduce((prev, now) => now(prev), model);
}

export function fromJSON<S>(preloadedState: JSONState<S>, state: S): S {
  if (isJSONSerializable(state)) {
    return state.fromJSON(preloadedState);
  }
  return preloadedState as S;
}

export function isJSONSerializable(obj: any): obj is JSONSerializable<any> {
  return !!obj && 'fromJSON' in obj;
}

export function toString(obj: unknown) {
  return Object.prototype.toString.call(obj);
}

export class CheapSet<T extends keyof any = string> {
  private data: Record<T, true> = {} as Record<T, true>;

  constructor(values: readonly T[] = []) {
    values.forEach((v) => this.add(v));
  }

  add(value: T) {
    this.data[value] = true;
  }

  delete(value: T) {
    delete this.data[value];
  }

  clear() {
    this.data = {} as Record<T, true>;
  }

  has(value: T) {
    return this.data.hasOwnProperty(value);
  }

  forEach(fn: (value: T extends string ? T : string) => void) {
    for (const value in this.data) {
      if (this.data.hasOwnProperty(value)) {
        fn(value);
      }
    }
  }

  some(fn: (value: T extends string ? T : string) => boolean): boolean {
    for (const value in this.data) {
      if (this.data.hasOwnProperty(value)) {
        if (fn(value)) {
          return true;
        }
      }
    }
    return false;
  }

  every(fn: (value: T extends string ? T : string) => boolean): boolean {
    for (const value in this.data) {
      if (this.data.hasOwnProperty(value)) {
        if (!fn(value)) {
          return false;
        }
      }
    }
    return true;
  }
}

export class CheapMap<V, K extends keyof any = string> {
  private data: Record<K, V> = {} as Record<K, V>;

  set(key: K, value: V) {
    this.data[key] = value;
  }

  delete(key: K) {
    delete this.data[key];
  }

  clear() {
    this.data = {} as Record<K, V>;
  }

  has(key: K) {
    return this.data.hasOwnProperty(key);
  }

  get(key: K): V | undefined {
    return this.data[key];
  }

  take(key: K): V {
    if (process.env.NODE_ENV === 'development') {
      threw(!this.has(key), `Cannot get non-existent key ${key}.`);
    }
    return this.data[key];
  }

  some(fn: (value: V, key: K extends string ? K : string) => boolean): boolean {
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        if (fn(this.data[key], key)) {
          return true;
        }
      }
    }
    return false;
  }

  every(fn: (value: V, key: K extends string ? K : string) => boolean): boolean {
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        if (!fn(this.data[key], key)) {
          return false;
        }
      }
    }
    return true;
  }
}
