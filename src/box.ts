/*
 * @since 2020-11-03 16:25:01
 * @author acrazing <joking.young@gmail.com>
 */

import { EventFactory } from './event';

declare const __magicType: unique symbol;

/**
 * A magic type alias for avoiding TypeScript circle reference
 */
type JSONValue<R> = R extends { [__magicType]: infer E } ? E : R;

/**
 * Convert a type to the jsonify type of it, which means
 * it will drop the function fields and convert it to the
 * return type of its `toJSON()` if it exists.
 *
 * @example
 * ```typescript
 * interface Foo {
 *   toJSON(): number;
 * }
 *
 * interface Root {
 *   id: number;
 *   foo: Foo[];
 * }
 *
 * declare const data: JSONState<Root> // <= { id: number, foo: number[] }
 * ```
 *
 * @expermential
 */
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

/**
 * A `Box` is an object to keep the information of a state node, includes
 * the `key`, `initialState`, and the state transformer.
 *
 * `Box` is selectable, the select result is the state of the box in the store.
 *
 * A `Box` could subscribe one or more events by calling `box.subscribe()`
 * method, which will mutate the state of the box when the event is dispatched.
 *
 * @stable
 */
export interface Box<S = any> {
  /** @internal */
  readonly key: string;
  /** @internal */
  readonly initialState: S;
  /** @internal */
  readonly listeners: [EventFactory<any, any>, (state: S, data: any) => S][];
  /** @internal */
  readonly preload: (preloadedState: JSONState<S>, state: S) => S;
  /**
   * subscribe an `event`, the `fn` will be called when you call
   * `store.dispatch(event(data))`, the first parameter of `fn` is
   * the state of the box, and the second one is the data of the
   * event, and its return value will be set as the new state of
   * the box.
   *
   * @param event the event factory
   * @param fn the callback
   */
  readonly subscribe: <T>(event: EventFactory<any, T>, fn: (state: S, data: T) => S) => void;
}

/**
 * Create a box.
 *
 * @param key the key of the box, it is used for keeping the relation of the box
 *            and its state in a store, it **SHOULD** be unique in your project.
 * @param initialState the initial state of the box, the state of a box **SHOULD**
 *                     be immutable, which means the mutators (include the mutations
 *                     and event subscribers) should return a new state if the updates
 *                     the state.
 * @param preload a function to transform the preloaded state to the state of the box
 *
 * @stable
 */
export function box<S>(
  key: string,
  initialState: S,
  preload: (preloadedState: JSONState<S>, state: S) => S,
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
