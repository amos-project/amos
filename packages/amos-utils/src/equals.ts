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
export const truly = <T>(value: T | undefined | null): value is T => value != null;
export const falsy = <T>(value: T | undefined | null): value is undefined | null => value == null;
export type EqualFn<T> = (a: T, b: T) => boolean;

/**
 * Check two objects is shallow equal or not
 * @param a
 * @param b
 */
export function shallowEqual<T extends {}>(a: T, b: T): boolean {
  if (is(a, b)) {
    return true;
  }
  const ka = Object.keys(a) as Array<keyof T>;
  if (ka.length !== Object.keys(b).length) {
    return false;
  }
  return ka.every((k) => a[k] === b[k]);
}

export function propsEqual<T extends {}>(a: T, b: Partial<T>): boolean {
  if (is(a, b)) {
    return true;
  }
  const kb = Object.keys(b) as Array<keyof T>;
  return kb.every((k) => a[k] === b[k]);
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

export type ShapeEqualSchema<T> = T extends readonly (infer U)[]
  ? [ShapeEqualSchema<U>]
  : EqualFn<T>;

function shapeEqualExec<T>(a: T, b: T, schema: ShapeEqualSchema<T>): boolean {
  if (Array.isArray(schema)) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((value, index) => shapeEqualExec(value, b[index], schema[0]))
    );
  }
  return schema(a, b);
}

export function shapeEqual<T>(schema: ShapeEqualSchema<T>): EqualFn<T> {
  return (a: T, b: T) => shapeEqualExec(a, b, schema);
}
