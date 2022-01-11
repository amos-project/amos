/*
 * @since 2021-01-19 23:36:37
 * @author acrazing <joking.young@gmail.com>
 */

import Mock = jest.Mock;
import { applyMutation, Mutation } from 'amos-core';
import { JSONState } from 'amos-utils';

export function sleep(timeout: number = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

export function expectCalled(fn: (...args: any[]) => any, count = 1) {
  expect(fn).toBeCalledTimes(count);
  (fn as Mock).mockClear();
}

export function applyMutations<S>(state: S, mutations: Mutation<any, S>[]) {
  return mutations.map((mutation: Mutation<any, S>) => {
    state = applyMutation(state, mutation);
    return state;
  });
}

export function toJS<T>(v: T): JSONState<T> {
  return JSON.parse(JSON.stringify(v));
}
