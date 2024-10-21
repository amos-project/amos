/*
 * @since 2024-10-17 21:04:28
 * @author junbao <junbao@moego.pet>
 */

import { isObject } from './equals';
import { Mutable } from './types';

export const $amos = Symbol('$amos');

export interface AmosObject<T extends string> {
  readonly [$amos]: T;
  readonly id: string;
}

let nextId = 0;
const prefix = Date.now() + '-';

export function createAmosObject<T extends AmosObject<any>>(
  key: T[typeof $amos],
  props: Omit<T, typeof $amos | 'id'> & Partial<Pick<T, 'id'>>,
): T {
  (props as Mutable<T>)[$amos] = key;
  (props as Mutable<T>).id ??= prefix + ++nextId;
  return props as T;
}

export function isAmosObject<S extends AmosObject<any>>(obj: any, key: S[typeof $amos]): obj is S {
  return isObject(obj) && obj[$amos] === key;
}
