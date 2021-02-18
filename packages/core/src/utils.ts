/*
 * @since 2020-11-04 11:12:36
 * @author acrazing <joking.young@gmail.com>
 */

let nextId = 1;

/** @internal */
export function uid() {
  return nextId++;
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
