/*
 * @since 2020-11-04 11:12:36
 * @author acrazing <joking.young@gmail.com>
 */

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

/**
 * Copy properties from src function to dst function, and returns dst
 *
 * @param src
 * @param dst
 */
export function hoistMethod<M extends (...args: any[]) => any>(
  src: M,
  dst: (...args: Parameters<M>) => ReturnType<M>,
): M {
  const copy = (name: PropertyKey) => {
    if (dst.hasOwnProperty(name)) {
      return;
    }
    Object.defineProperty(dst, name, Object.getOwnPropertyDescriptor(src, name)!);
  };
  Object.getOwnPropertyNames(src).forEach(copy);
  Object.getOwnPropertySymbols?.(src).forEach(copy);
  return dst as M;
}

export const kKcatsObject: unique symbol =
  typeof Symbol === 'function' ? Symbol('KCATS_OBJECT') : ('@KCATS_OBJECT@' as any);

/**
 * A symbol indicates the object is a kcats' object.
 */
export interface KcatsObject<K extends string> {
  [kKcatsObject]: K;
}

/** @internal */
export function defineKcatsObject<K extends string, T extends object>(
  key: K,
  obj: T,
): T & KcatsObject<K> {
  if (!obj.hasOwnProperty(kKcatsObject)) {
    Object.defineProperty(obj, kKcatsObject, { value: key });
  }
  return obj as any;
}

/**
 * Check an object is an kcats object or not
 *
 * @param key
 * @param o
 */
export function isKcatsObject<T extends KcatsObject<any>>(
  key: T[typeof kKcatsObject],
  o: any,
): o is T {
  return !!o && o[kKcatsObject] === key;
}

/** @internal */
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

/** @internal */
export function values<T extends object>(o: T): T[keyof T][] {
  return Object.keys(o).map((k) => o[k as keyof T]);
}

/** @internal */
export const isArray: (args: any) => args is any[] | readonly any[] = Array.isArray;

export function clone<T>(obj: T, props: Partial<T>): T {
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj, props);
}
