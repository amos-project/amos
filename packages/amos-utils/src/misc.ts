/*
 * @since 2020-11-04 11:12:36
 * @author acrazing <joking.young@gmail.com>
 */

import { ValueOrConstructor, ValueOrFactory } from './types';

export function resolveCallerName(depth = 2) {
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

export const ANY: any = void 0;

export function resolveCtorValue<V>(value: ValueOrConstructor<V>): V {
  return typeof value === 'function' ? new (value as any)() : value;
}

export function resolveFnValue<V, A extends any[]>(value: ValueOrFactory<V, A>, ...args: A): V {
  return typeof value === 'function' ? (value as any)(...args) : value;
}

export function removeElement<T>(input: T[], item: T) {
  const index = input.indexOf(item);
  return index > -1 ? input.splice(index, 1) : input;
}
