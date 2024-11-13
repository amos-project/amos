/*
 * @since 2022-01-06 17:19:05
 * @author junbao <junbao@moego.pet>
 */

import { isArray, isObject } from './equals';
import { noop } from './misc';
import { IsAny } from './types';

export type JSONState<S> =
  IsAny<S> extends true
    ? any
    : S extends ToJSON<infer R>
      ? JSONState<R>
      : S extends object
        ? S extends (...args: any[]) => any
          ? null
          : { [P in keyof S]: JSONState<S[P]> }
        : S;

export interface ToJSON<T> {
  toJSON(): T;
}

export interface FromJS<T> {
  // should satisfy the expression: state === toJS(fromJS(state))
  // which means: should fully delete current state, and merge deeply.
  fromJS(state: JSONState<T>): this;
}

export interface JSONSerializable<S> extends ToJSON<S>, FromJS<S> {}

export function isToJSON(obj: unknown): obj is ToJSON<any> {
  return isObject(obj) && 'toJSON' in obj;
}

export function isFromJS(obj: unknown): obj is FromJS<any> {
  return isObject(obj) && 'fromJS' in obj;
}

export function jsonEmpty<T extends object>(v: T): T & ToJSON<void> {
  return Object.assign(v, { toJSON: noop });
}

export function isJSONSerializable(obj: unknown): obj is JSONSerializable<any> {
  return isToJSON(obj) && isFromJS(obj);
}

export function toJS<T>(v: T): JSONState<T> {
  if (typeof v !== 'object' || v === null) {
    return v as any;
  }
  if (Array.isArray(v)) {
    return v.map((e) => toJS(e)) as any;
  }
  if (isToJSON(v)) {
    return toJS(v.toJSON());
  }
  const o: any = {};
  for (const k in v) {
    if (Object.hasOwn(v, k)) {
      o[k] = toJS(v[k]);
    }
  }
  return o;
}

// merge json objects
// respect fromJS method
// for object, merge with prototype
// for array and other types, replace with input
export function fromJS<T>(v: T, s: unknown): T {
  if (isFromJS(v)) {
    return v.fromJS(s);
  }
  // dst or src is not an object or is an array
  if (!isObject(v) || isArray(v) || !isObject(s) || isArray(s)) {
    return s as T;
  }
  const o: any = { ...v };
  for (const k in s as any) {
    if (Object.hasOwn(s, k)) {
      o[k] = fromJS(o[k], (s as any)[k]);
    }
  }
  return Object.setPrototypeOf(o, Object.getPrototypeOf(v));
}
