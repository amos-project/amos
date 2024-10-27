/*
 * @since 2021-01-19 23:36:37
 * @author acrazing <joking.young@gmail.com>
 */

import Mock = jest.Mock;
import { Mutation } from 'amos-core';
import { JSONState } from 'amos-utils';

export function sleep(timeout: number = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

export function checkType(fn: () => void) {}

export function expectCalled(fn: (...args: any[]) => any, count = 1) {
  expect(fn).toHaveBeenCalledTimes(count);
  (fn as Mock).mockClear();
}

export function expectCalledWith(fn: jest.Mock, ...args: any[][]) {
  expect(fn).toHaveBeenCalledTimes(args.length);
  for (const [i, a] of args.entries()) {
    expect(fn).toHaveBeenNthCalledWith(i + 1, ...a);
  }
  fn.mockClear();
}

export function applyMutations<S>(state: S, mutations: readonly Mutation<S>[]) {
  return mutations
    .reduce((prev, mutation) => prev.concat([mutation.mutator(prev.at(-1)!)]), [state])
    .slice(1);
}

export function toJS<T>(v: T): JSONState<T> {
  return JSON.parse(JSON.stringify(v));
}

export type EnumHost = Record<string | number, string | number>;

export function enumLabels<T extends Record<string | number, string | number>, R>(
  host: T,
  labels: globalThis.Record<Exclude<keyof T, number>, R>,
): Record<keyof T | Extract<T[keyof T], number>, R> {
  const out: Record<string | number, R> = {};
  for (const k in labels) {
    out[k] = labels[k];
    out[host[k]] = labels[k];
  }
  return out as any;
}

export enum Foo {
  Bar = 1,
  Baz = 'Baz',
}

export const FooLabels = enumLabels(Foo, {
  Bar: { hello: 'Bar' },
  Baz: { hello: 'Baz' },
});
