/*
 * @since 2020-11-03 13:31:31
 * @author acrazing <joking.young@gmail.com>
 */

import { Action } from './action';
import { Box } from './box';
import { Event } from './event';
import { Mutation } from './mutation';
import { Selector } from './selector';
import { arrayEqual, isArray } from './utils';

export type Request<R = any> = Mutation<any, R> | Action<R> | Event<R>;

export interface Dispatch {
  <R>(request: Request<R>): R;
  <R1>(requests: readonly [Request<R1>]): [R1];
  <R1, R2>(requests: readonly [Request<R1>, Request<R2>]): [R1, R2];
  <R1, R2, R3>(requests: readonly [Request<R1>, Request<R2>, Request<R3>]): [R1, R2, R3];
  <R1, R2, R3, R4>(requests: readonly [Request<R1>, Request<R2>, Request<R3>, Request<R4>]): [
    R1,
    R2,
    R3,
    R4,
  ];
  <R1, R2, R3, R4, R5>(
    requests: readonly [Request<R1>, Request<R2>, Request<R3>, Request<R4>, Request<R5>],
  ): [R1, R2, R3, R4, R5];
  <R1, R2, R3, R4, R5, R6>(
    requests: readonly [
      Request<R1>,
      Request<R2>,
      Request<R3>,
      Request<R4>,
      Request<R5>,
      Request<R6>,
    ],
  ): [R1, R2, R3, R4, R5, R6];
  <R1, R2, R3, R4, R5, R6, R7>(
    requests: readonly [
      Request<R1>,
      Request<R2>,
      Request<R3>,
      Request<R4>,
      Request<R5>,
      Request<R6>,
      Request<R7>,
    ],
  ): [R1, R2, R3, R4, R5, R6, R7];
  <R1, R2, R3, R4, R5, R6, R7, R8>(
    requests: readonly [
      Request<R1>,
      Request<R2>,
      Request<R3>,
      Request<R4>,
      Request<R5>,
      Request<R6>,
      Request<R7>,
      Request<R8>,
    ],
  ): [R1, R2, R3, R4, R5, R6, R7, R8];
  <R1, R2, R3, R4, R5, R6, R7, R8, R9>(
    requests: readonly [
      Request<R1>,
      Request<R2>,
      Request<R3>,
      Request<R4>,
      Request<R5>,
      Request<R6>,
      Request<R7>,
      Request<R8>,
      Request<R9>,
    ],
  ): [R1, R2, R3, R4, R5, R6, R7, R8, R9];
  <R>(requests: readonly Request<R>[]): R[];
}

export interface Store {
  dispatch: Dispatch;
  pick: <S>(box: Box<S>) => S;
  select: <R>(selector: Selector<any[], R>) => R;
  subscribe: (fn: () => void) => () => void;
  getState: () => unknown;
}

export function createStore(
  preloadedState: Record<string, unknown> = {},
  ...enhancers: Array<(store: Store) => Store>
): Store {
  const state: Record<string, unknown> = {};
  const boxes: Box[] = [];
  const listeners: Array<() => void> = [];
  const ensure = (box: Box) => {
    if (state.hasOwnProperty(box.key)) {
      return;
    }
    let initialState = box.initialState();
    if (preloadedState.hasOwnProperty(box.key)) {
      initialState = box.preload(initialState, preloadedState[box.key]);
    }
    state[box.key] = initialState;
    boxes.push(box);
  };

  let dispatching = 0;
  let mutated = false;

  const exec = (request: Request) => {
    if (request.object === 'mutation') {
      const {
        box,
        box: { key },
        action,
        mutator,
      } = request;
      ensure(box);
      mutated ||= state[key] !== (state[key] = mutator(state[key], action));
      return action;
    } else if (request.object === 'action') {
      return request(store);
    } else if (request.object === 'event') {
      const { data, factory } = request;
      for (const { key, listeners } of boxes) {
        for (const [e, fn] of listeners) {
          if (e === factory) {
            mutated ||= state[key] !== (state[key] = fn(state[key], data));
          }
        }
      }
      return data;
    }
  };

  let store: Store = {
    dispatch: (requests: Request | readonly Request[]) => {
      mutated &&= dispatching !== 0;
      dispatching++;
      try {
        if (isArray(requests)) {
          return requests.map((atom) => exec(atom));
        } else {
          return exec(requests);
        }
      } finally {
        dispatching--;
        if (dispatching === 0 && mutated) {
          listeners.forEach((fn) => fn());
        }
      }
    },
    pick: <S>(box: Box<S>): S => {
      ensure(box);
      return state[box.key] as S;
    },
    subscribe: (fn) => {
      listeners.push(fn);
      return () => {
        const index = listeners.indexOf(fn);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
    getState: () => state,
    select: ({ factory, args }) => {
      const ss = factory.deps.map(store.pick);
      const input = [store].concat(ss, args);
      if (factory.cacheKey) {
        const key = factory.cacheKey(...input);
        if (factory.lastKey && arrayEqual(factory.lastKey, key)) {
          return factory.lastValue!;
        }
        factory.lastValue = factory.selector(...input);
        factory.lastKey = key;
        return factory.lastValue;
      }
      return factory.selector(...input);
    },
  };
  store = enhancers.reduce((previousValue, currentValue) => currentValue(previousValue), store);
  return store;
}
