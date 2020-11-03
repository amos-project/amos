/*
 * @since 2020-11-03 13:31:31
 * @author acrazing <joking.young@gmail.com>
 */

import { Action } from './action';
import { Atom, Box } from './box';

export type Mutation<R = any> = Action<any, R> | Atom<R>;

export interface Dispatch {
  <R>(main: Mutation<R>, ...others: Mutation[]): R;
  <R1>(mutations: readonly [Mutation<R1>]): [R1];
  <R1, R2>(mutations: readonly [Mutation<R1>, Mutation<R2>]): [R1, R2];
  <R1, R2, R3>(mutations: readonly [Mutation<R1>, Mutation<R2>, Mutation<R3>]): [R1, R2, R3];
  <R1, R2, R3, R4>(mutations: readonly [Mutation<R1>, Mutation<R2>, Mutation<R3>, Mutation<R4>]): [
    R1,
    R2,
    R3,
    R4,
  ];
  <R1, R2, R3, R4, R5>(
    mutations: readonly [Mutation<R1>, Mutation<R2>, Mutation<R3>, Mutation<R4>, Mutation<R5>],
  ): [R1, R2, R3, R4, R5];
  <R1, R2, R3, R4, R5, R6>(
    mutations: readonly [
      Mutation<R1>,
      Mutation<R2>,
      Mutation<R3>,
      Mutation<R4>,
      Mutation<R5>,
      Mutation<R6>,
    ],
  ): [R1, R2, R3, R4, R5, R6];
  <R1, R2, R3, R4, R5, R6, R7>(
    mutations: readonly [
      Mutation<R1>,
      Mutation<R2>,
      Mutation<R3>,
      Mutation<R4>,
      Mutation<R5>,
      Mutation<R6>,
      Mutation<R7>,
    ],
  ): [R1, R2, R3, R4, R5, R6, R7];
  <R1, R2, R3, R4, R5, R6, R7, R8>(
    mutations: readonly [
      Mutation<R1>,
      Mutation<R2>,
      Mutation<R3>,
      Mutation<R4>,
      Mutation<R5>,
      Mutation<R6>,
      Mutation<R7>,
      Mutation<R8>,
    ],
  ): [R1, R2, R3, R4, R5, R6, R7, R8];
  <R1, R2, R3, R4, R5, R6, R7, R8, R9>(
    mutations: readonly [
      Mutation<R1>,
      Mutation<R2>,
      Mutation<R3>,
      Mutation<R4>,
      Mutation<R5>,
      Mutation<R6>,
      Mutation<R7>,
      Mutation<R8>,
      Mutation<R9>,
    ],
  ): [R1, R2, R3, R4, R5, R6, R7, R8, R9];
  <R>(mutations: readonly Mutation<R>[]): R[];
}

export interface Store {
  dispatch: Dispatch;
  pick: <S>(box: Box<S>) => S;
  subscribe: (fn: () => void) => () => void;
  getState: () => unknown;
}

export function createStore(preloadedState: Record<string, unknown> = {}): Store {
  const state: Record<string, unknown> = {};
  const listeners: Array<() => void> = [];
  let dispatching = 0;
  const ensure = (box: Box) => {
    if (state.hasOwnProperty(box.key)) {
      return;
    }
    let initialState = box.initialState;
    if (typeof initialState === 'function') {
      initialState = initialState();
    }
    if (preloadedState.hasOwnProperty(box.key)) {
      initialState = box.preload(initialState, preloadedState[box.key]);
    }
    state[box.key] = initialState;
  };
  const exec = (mutation: Mutation) => {
    if (mutation.object === 'atom') {
      ensure(mutation.factory.box);
      return mutation.factory.atom(state[mutation.factory.box.key], mutation.action);
    } else {
      return mutation.factory.action(store, store.dispatch, ...mutation.args);
    }
  };
  const dispatch: Dispatch = (first: Mutation | readonly Mutation[], ...others: Mutation[]) => {
    dispatching++;
    if (process.env.NODE_ENV === 'development' && dispatching > 64) {
      throw new Error(`[Moedux] max dispatch depth exceeded.`);
    }
    try {
      let result: any;
      if (Array.isArray(first)) {
        result = first.map((m) => exec(m));
      } else {
        result = exec(first as Mutation);
        others.forEach((m) => exec(m));
      }
      if (dispatching === 1) {
        listeners.forEach((fn) => fn());
      }
      return result;
    } finally {
      dispatching--;
    }
  };

  const pick = <S>(box: Box<S>): S => {
    ensure(box);
    return state[box.key] as S;
  };

  const subscribe = (fn: () => void): (() => void) => {
    listeners.push(fn);
    return () => {
      const index = listeners.indexOf(fn);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };

  const getState = () => state;

  const store: Store = { dispatch, pick, subscribe, getState };
  return store;
}
