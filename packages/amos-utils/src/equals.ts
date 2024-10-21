/*
 * @since 2022-01-06 18:51:44
 * @author junbao <junbao@moego.pet>
 */

/** @internal */
export function shimObjectIs(x: any, y: any) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

export const is: (x: any, y: any) => boolean = Object.is || shimObjectIs;

/**
 * Returns the first argument
 * @param v
 */
export const identity = <T>(v: T) => v;
export const notNullable = <T>(v: T): v is Exclude<T, undefined | null> => v != null;
export const isNullable = (v: unknown): v is undefined | null => v == null;
export const isTruly = <T>(v: T): v is Exclude<T, undefined | null | '' | 0 | false> => !!v;

/**
 * Check two objects is shallow equal or not
 * @param a
 * @param b
 */
export function shallowEqual<T>(a: T, b: T): boolean {
  if (is(a, b)) {
    return true;
  }
  if (!isObject(a) || !isObject(b)) {
    return false;
  }
  const ka = Object.keys(a) as Array<keyof T>;
  if (ka.length !== Object.keys(b).length) {
    return false;
  }
  return ka.every((k) => a[k] === b[k]);
}

export function shallowContainEqual<T>(a: T, b: Partial<T>): boolean {
  if (is(a, b)) {
    return true;
  }
  if (!isObject(a) || !isObject(b)) {
    return false;
  }
  const kb = Object.keys(b) as Array<keyof T>;
  return kb.every((k) => is(a[k], b[k]));
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

export function isObject<T>(v: T): v is Extract<T, object> {
  return typeof v === 'object' && v !== null;
}

export const isArray: <T>(v: T) => v is Extract<T, readonly any[]> = Array.isArray as any;

export function isPlainObject(v: unknown): v is object {
  if (!isObject(v)) {
    return false;
  }
  const proto = Object.getPrototypeOf(v);
  return proto === null || proto === Object.prototype;
}
