/*
 * @since 2020-11-28 10:41:23
 * @author acrazing <joking.young@gmail.com>
 */

import { Action } from './action';
import { Box, Mutation } from './box';
import { FunctionSelector, Selector, SelectorFactory } from './selector';
import { Signal } from './signal';

export interface AmosObject<T extends string> {
  $object: T;
}

export type JSONState<S> = S extends { toJSON(): infer R } ? JSONState<R> : S extends object ? { [P in keyof S]: JSONState<S[P]> } : S;

export interface JSONSerializable<S> {
  toJSON(): S;
  fromJSON(state: JSONState<S>): this;
}

export type Snapshot = Record<string, unknown>;

/**
 * A dispatchable MUST be predefined for distinguish with redux's action.
 *
 * As a result, we dropped FunctionAction.
 */
export type Dispatchable<R = any> = Mutation<any, R> | Action<any, R> | Signal<R>;

export interface AmosDispatch {
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

export interface Dispatch extends AmosDispatch {}

export type Selectable<R = any> = SelectorFactory<[], R> | Box<R> | Selector<any, R> | FunctionSelector<R>;

export interface Select {
  <A extends Selectable>(selectable: A): A extends Selectable<infer R> ? R : never;
}

export type Subscribe = () => void;
export type Unsubscribe = () => void;

export type MapSelector<Rs extends readonly Selectable[]> = {
  [P in keyof Rs]: Rs[P] extends Selectable<infer R> ? R : never;
};

export interface Cache<T> {
  get(id: string): T | undefined;
  set(id: string, value: T): void;
  delete(id: string): void;
}
