/*
 * @since 2020-11-03 16:25:01
 * @author acrazing <joking.young@gmail.com>
 */

import { SignalFactory } from './signal';
import { fromJSON, JSONState } from './types';
import { clone } from './utils';

/**
 * A `Mutation` is a dispatchable object, which will update the
 * target box's state **synchronously** when you dispatch it.
 * The only way to create a `Mutation` is call the `MutationFactory`
 * which is created by calling `mutation()` method. You don't need
 * to pay attention to any properties of the `Mutation`.
 *
 * The return value of dispatch it is the action.
 */
export interface Mutation<S = any, A extends any[] = any> {
  $object: 'mutation';
  args: A;
  factory: MutationFactory;
}

export interface MutationFactory<S = any, A extends any[] = any> {
  $object: 'mutation_factory';
  (...args: A): Mutation<S, A>;
  type: string | undefined;
  box: Box<S>;
  mutator: (state: S, ...args: A) => S;
}

/**
 * A `Box` is an object to keep the information of a state node, includes
 * the `key`, `initialState`, and the state transformer.
 *
 * `Box` is selectable, the select result is the state of the box in the store.
 *
 * A `Box` could subscribe one or more events by calling `box.subscribe()`
 * method, which will mutate the state of the box when the event is dispatched.
 */
export class Box<S = any> {
  readonly signalSubscribers: Record<string, (state: S, data: any) => S>;

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
  constructor(
    readonly key: string,
    readonly initialState: S,
    readonly preload: (preloadedState: JSONState<S>, state: S) => S = fromJSON,
  ) {
    this.key = key;
    this.initialState = initialState;
    this.preload = preload;
    this.signalSubscribers = {};
  }

  /**
   * subscribe an `event`, the `fn` will be called when you call
   * `store.dispatch(event(data))`, the first parameter of `fn` is
   * the state of the box, and the second one is the data of the
   * event, and its return value will be set as the new state of
   * the box.
   *
   * @param signal the event factory
   * @param fn the callback
   */
  subscribeSignal<T>(signal: string | SignalFactory<any, T>, fn: (state: S, data: T) => S) {
    const type = typeof signal === 'string' ? signal : signal.type;
    this.signalSubscribers[type] = fn;
  }

  mutation<A extends any[]>(
    mutator: (state: S, ...args: A) => S,
    type?: string,
  ): MutationFactory<S, A> {
    const factory = Object.assign(
      (...args: A): Mutation<S, A> => ({
        $object: 'mutation',
        args,
        factory,
      }),
      {
        $object: 'mutation_factory' as const,
        type,
        box: this,
        mutator,
      },
    );
    return factory;
  }

  setState = this.mutation((state, nextState: S | ((prevState: S) => S)) => {
    return typeof nextState === 'function' ? (nextState as (prevState: S) => S)(state) : nextState;
  }, `${this.key}/setState`);

  mergeState = this.mutation(
    (state, partialNextState: Partial<S> | ((prevState: S) => Partial<S>)) => {
      return clone(
        state,
        typeof partialNextState === 'function'
          ? (partialNextState as (prevState: S) => Partial<S>)(state)
          : partialNextState,
      );
    },
    `${this.key}/mergeState`,
  );
}
