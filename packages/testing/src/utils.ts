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

export function expectCalled(fn: (...args: any[]) => any, count = 1) {
  expect(fn).toBeCalledTimes(count);
  (fn as Mock).mockClear();
}

export function applyMutations<S>(state: S, mutations: Mutation<any, S>[]) {
  mutations.forEach((mutation: Mutation<any, S>) => {
    mutation.mutator.apply(mutation.box, [state, ...mutation.args]);
  });
  return state;
}

export function toJS<T>(v: T): JSONState<T> {
  return JSON.parse(JSON.stringify(v));
}
