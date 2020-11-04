/*
 * @since 2020-11-03 13:31:31
 * @author acrazing <joking.young@gmail.com>
 */

import { Action } from './action';
import { Atom, Box } from './box';
import { Selector } from './selector';
import { arrayEqual, isArray } from './utils';

export type Mutation<R = any> = Atom<R> | Action<any[], R>;

export interface Dispatch {
  <R>(mutation: Mutation<R>): R;
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
  select: <R>(selector: Selector<any[], R>) => R;
  subscribe: (fn: () => void) => () => void;
  getState: () => unknown;
}

export function createStore(
  preloadedState: Record<string, unknown> = {},
  ...enhancers: Array<(store: Store) => Store>
): Store {
  const state: Record<string, unknown> = {};
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
  };

  let dispatching = 0;
  let mutated = false;

  const exec = (mutation: Mutation) => {
    if (mutation.object === 'atom') {
      const {
        action,
        factory: {
          box,
          box: { key },
          atom,
        },
      } = mutation;
      ensure(box);
      mutated ||= state[key] !== (state[key] = atom(state[key], action));
      return action;
    } else {
      return mutation.factory.action(store, ...mutation.args);
    }
  };

  let store: Store = {
    dispatch: (atoms: Mutation | readonly Mutation[]) => {
      mutated &&= dispatching !== 0;
      dispatching++;
      try {
        if (isArray(atoms)) {
          return atoms.map((atom) => exec(atom));
        } else {
          return exec(atoms);
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
