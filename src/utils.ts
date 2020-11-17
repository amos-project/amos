/*
 * @since 2020-11-04 11:12:36
 * @author acrazing <joking.young@gmail.com>
 */

export const identity = <T>(v: T) => v;

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

export const kAmosObject: unique symbol =
  typeof Symbol === 'function' ? Symbol('AMOS_OBJECT') : ('Symbol(AMOS_OBJECT)' as any);

export interface AmosObject<K extends string> {
  [kAmosObject]: K;
}

export function defineAmosObject<K extends string, T extends object>(
  key: K,
  obj: T,
): T & AmosObject<K> {
  if (!obj.hasOwnProperty(kAmosObject)) {
    Object.defineProperty(obj, kAmosObject, { value: key });
  }
  return obj as any;
}

export function isAmosObject<T extends AmosObject<any>>(
  key: T[typeof kAmosObject],
  o: any,
): o is T {
  return !!o && o[kAmosObject] === key;
}

export function strictEqual<T>(a: T, b: T) {
  return a === b;
}

export function arrayEqual<T>(a: T[], b: T[]) {
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
