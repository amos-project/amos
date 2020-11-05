/*
 * @since 2020-11-03 16:25:01
 * @author acrazing <joking.young@gmail.com>
 */

import { EventFactory } from './event';

declare const __magicType: unique symbol;

type JSONValue<R> = R extends { [__magicType]: infer E } ? E : R;

export type JSONState<S> = JSONValue<
  S extends { toJSON(): infer R }
    ? { [__magicType]: JSONState<R> }
    : S extends (infer E)[]
    ? { [__magicType]: JSONState<E>[] }
    : S extends object
    ? {
        [P in keyof S]: JSONState<S[P]>;
      }
    : S
>;

export interface Box<S = any> {
  key: string;
  initialState: S;
  preload: (state: S, preloadedState: JSONState<S>) => S;
  listeners: [EventFactory<any, any>, (state: S, data: any) => S][];
  subscribe: <T>(event: EventFactory<any, T>, fn: (state: S, data: T) => S) => void;
}

export function box<S>(
  key: string,
  initialState: S,
  preload: (state: S, preloadedState: JSONState<S>) => S,
): Box<S> {
  const listeners: Box<S>['listeners'] = [];
  return {
    key,
    initialState,
    preload,
    listeners,
    subscribe: (event, fn) => listeners.push([event, fn]),
  };
}
