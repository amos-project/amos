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
  mutation: Mutation<any, R>;
  action: Action<any, R>;
  signal: Signal<any, R>;
}

export type Dispatchable<R = any> = DispatchableRecord<R>[keyof DispatchableRecord<R>];

export interface Dispatch {
  <R>(task: Dispatchable<R>): R;
  <R1>(tasks: readonly [Dispatchable<R1>]): [R1];
  <R1, R2>(tasks: readonly [Dispatchable<R1>, Dispatchable<R2>]): [R1, R2];
  <R1, R2, R3>(tasks: readonly [Dispatchable<R1>, Dispatchable<R2>, Dispatchable<R3>]): [R1, R2, R3];
  <R1, R2, R3, R4>(tasks: readonly [Dispatchable<R1>, Dispatchable<R2>, Dispatchable<R3>, Dispatchable<R4>]): [R1, R2, R3, R4];
  <R1, R2, R3, R4, R5>(tasks: readonly [Dispatchable<R1>, Dispatchable<R2>, Dispatchable<R3>, Dispatchable<R4>, Dispatchable<R5>]): [R1, R2, R3, R4, R5];
  <R1, R2, R3, R4, R5, R6>(tasks: readonly [Dispatchable<R1>, Dispatchable<R2>, Dispatchable<R3>, Dispatchable<R4>, Dispatchable<R5>, Dispatchable<R6>]): [R1, R2, R3, R4, R5, R6];
  <R1, R2, R3, R4, R5, R6, R7>(tasks: readonly [Dispatchable<R1>, Dispatchable<R2>, Dispatchable<R3>, Dispatchable<R4>, Dispatchable<R5>, Dispatchable<R6>, Dispatchable<R7>]): [R1, R2, R3, R4, R5, R6, R7];
  <R1, R2, R3, R4, R5, R6, R7, R8>(tasks: readonly [Dispatchable<R1>, Dispatchable<R2>, Dispatchable<R3>, Dispatchable<R4>, Dispatchable<R5>, Dispatchable<R6>, Dispatchable<R7>, Dispatchable<R8>]): [R1, R2, R3, R4, R5, R6, R7, R8];
  <R1, R2, R3, R4, R5, R6, R7, R8, R9>(tasks: readonly [Dispatchable<R1>, Dispatchable<R2>, Dispatchable<R3>, Dispatchable<R4>, Dispatchable<R5>, Dispatchable<R6>, Dispatchable<R7>, Dispatchable<R8>, Dispatchable<R9>]): [R1, R2, R3, R4, R5, R6, R7, R8, R9];
  <R>(tasks: readonly Dispatchable<R>[]): R[];
}

export interface SelectableRecord<R> {
  box: Box<R>;
  selector: Selector<any, R>;
}

export type Selectable<R = any> = SelectableRecord<R>[keyof SelectableRecord<R>];

export interface Select {
  <R>(selector: Selectable<R>): R;
  <R1>(selector: readonly [Selectable<R1>]): [R1];
  <R1, R2>(selector: readonly [Selectable<R1>, Selectable<R2>]): [R1, R2];
  <R1, R2, R3>(selector: readonly [Selectable<R1>, Selectable<R2>, Selectable<R3>]): [R1, R2, R3];
  <R1, R2, R3, R4>(selector: readonly [Selectable<R1>, Selectable<R2>, Selectable<R3>, Selectable<R4>]): [R1, R2, R3, R4];
  <R1, R2, R3, R4, R5>(selector: readonly [Selectable<R1>, Selectable<R2>, Selectable<R3>, Selectable<R4>, Selectable<R5>]): [R1, R2, R3, R4, R5];
  <R1, R2, R3, R4, R5, R6>(selector: readonly [Selectable<R1>, Selectable<R2>, Selectable<R3>, Selectable<R4>, Selectable<R5>, Selectable<R6>]): [R1, R2, R3, R4, R5, R6];
  <R1, R2, R3, R4, R5, R6, R7>(selector: readonly [Selectable<R1>, Selectable<R2>, Selectable<R3>, Selectable<R4>, Selectable<R5>, Selectable<R6>, Selectable<R7>]): [R1, R2, R3, R4, R5, R6, R7];
  <R1, R2, R3, R4, R5, R6, R7, R8>(selector: readonly [Selectable<R1>, Selectable<R2>, Selectable<R3>, Selectable<R4>, Selectable<R5>, Selectable<R6>, Selectable<R7>, Selectable<R8>]): [R1, R2, R3, R4, R5, R6, R7, R8];
  <R1, R2, R3, R4, R5, R6, R7, R8, R9>(selector: readonly [Selectable<R1>, Selectable<R2>, Selectable<R3>, Selectable<R4>, Selectable<R5>, Selectable<R6>, Selectable<R7>, Selectable<R8>, Selectable<R9>]): [R1, R2, R3, R4, R5, R6, R7, R8, R9];
  <R>(selector: readonly Selectable<R>[]): R[];
}

export type MapSelector<Rs extends readonly Selectable[]> = {
  [P in keyof Rs]: Rs[P] extends Selectable<infer R> ? R : never;
};

export type CacheKey = ValueOrReadonlyArray<ID>;
export type CacheOptions<A extends any[]> = ValueOrReadonlyArray<Selectable<string> | Selectable<number>> | SelectorFactory<A, CacheKey> | Compute<A, CacheKey>;
