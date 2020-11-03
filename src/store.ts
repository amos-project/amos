/*
 * @since 2020-11-03 13:31:31
 * @author acrazing <joking.young@gmail.com>
 */

import { Action } from './action';
import { Box, BoxFactory, MutatorSet } from './box';

export type MapBox<BFs extends BoxFactory[]> = {
  [P in keyof BFs]: BFs[P] extends BoxFactory<infer S, infer A>
    ? Box<S, A>
    : never;
};

export type MapState<BFs extends BoxFactory[]> = {
  [P in keyof BFs]: BFs[P] extends BoxFactory<infer S, infer A> ? S : never;
};

export interface Dispatch {
  <R>(action: Action<R>): R;
}

// the store is a pure object, the following methods
// is declared as function property rather than method
// means they are context free.
export interface Store {
  getState: () => any;
  dispatch: Dispatch;
  box: <S = any, MS extends MutatorSet<S> = any>(
    box: BoxFactory<S, MS>,
  ) => Box<S, MS>;
  boxes: <BFs extends BoxFactory[]>(...boxes: BFs) => MapBox<BFs>;
  get: <S = any>(box: BoxFactory<S>) => S;
  gets: <BFs extends BoxFactory[]>(...boxes: BFs) => MapState<BFs>;
  subscribe: (fn: () => void) => () => void;
  batch: (mutator: () => void) => void;
}

export function createStore(preloadedState?: any): Store {
  throw new Error('TODO');
}
