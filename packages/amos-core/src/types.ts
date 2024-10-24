/*
 * @since 2020-11-28 10:41:23
 * @author acrazing <joking.young@gmail.com>
 */

import { ID, ValueOrReadonlyArray } from 'amos-utils';
import { Action } from './action';
import { Box, Mutation } from './box';
import { Compute, Selector, SelectorFactory } from './selector';
import { Signal } from './signal';

export interface DispatchableRecord<R> {
  mutation: Mutation<R>;
  action: Action<any, R>;
  signal: Signal<any, R>;
}

export type Dispatchable<R = any> = DispatchableRecord<R>[keyof DispatchableRecord<R>];

export type ResultOfDispatchable<D> = D extends Dispatchable<infer R> ? R : never;

export type MapDispatchables<Rs extends readonly Dispatchable[]> = {
  [P in keyof Rs]: ResultOfDispatchable<Rs[P]>;
};

export interface Dispatch {
  <R>(dispatchable: Dispatchable<R>): R;
  <Rs extends readonly Dispatchable[] | []>(dispatchables: Rs): MapDispatchables<Rs>;
  <R>(dispatchables: readonly Dispatchable<R>[]): R[];
}

export interface SelectableRecord<R> {
  box: Box<R>;
  selector: Selector<any, R>;
}

export type Selectable<R = any> = SelectableRecord<R>[keyof SelectableRecord<R>];

export type StateOfSelectable<S> = S extends Selectable<infer R> ? R : never;

export type MapSelectables<Rs extends readonly Selectable[]> = {
  [P in keyof Rs]: StateOfSelectable<Rs[P]>;
};

export interface Select {
  <R>(selectable: Selectable<R>): R;
  <Rs extends readonly Selectable[] | []>(selectables: Rs): MapSelectables<Rs>;
  <R>(selectables: readonly Selectable<R>[]): R[];
}

export type CacheKey = ValueOrReadonlyArray<ID>;
export type CacheOptions<A extends any[]> = ValueOrReadonlyArray<Selectable<string> | Selectable<number>> | SelectorFactory<A, CacheKey> | Compute<A, CacheKey>;
