/*
 * @since 2020-11-03 16:25:01
 * @author acrazing <joking.young@gmail.com>
 */

import { SignalFactory } from './signal';
import { AmosObject, JSONState, MapSelector, Selectable } from './types';
import { clone, fromJSON, resolveCallerName, threw, warning } from './utils';

export interface MutationFactory<A extends any[] = any, S = any>
  extends AmosObject<'MUTATION_FACTORY'> {
  type: string | undefined;
  box: Box<S>;
  mutator: (state: S, ...args: A) => S;
  (...args: A): Mutation<A, S>;
}

export interface Mutation<A extends any[] = any, S = any> extends AmosObject<'MUTATION'> {
  args: A;
  factory: MutationFactory<A, S>;
}

export interface BoxWatchOptions<S, T extends readonly Selectable[]> {
  selectors: T;
  handler: (state: S, ...args: MapSelector<T>) => S;
}

export interface BoxOptions<S> {
  /**
   * determine how to load preloaded state to the box.
   * By default, if the fromJSON method exists in the state object,
   * the method will be called and its return value will be used as
   * the loading result, otherwise `preloadedState` will be used
   * directly as the loading result.
   */
  preload?: (preloadedState: JSONState<S>, state: S) => S;
}

export class Box<S = any> {
  readonly signals: Record<string, (state: S, data: any) => S> = {};

  /**
   * create a box instance
   *
   * @param key - the unique key of the box, it should be unique in your system
   * @param initialState - the initial state of the box, it should not be a function
   * @param options - the extra options for the box {@see BoxOptions}
   */
  constructor(
    readonly key: string,
    readonly initialState: S,
    readonly options: BoxOptions<S> = {},
  ) {
    if (process.env.NODE_ENV === 'development') {
      threw(typeof initialState === 'function', 'initialState should not be a function.');
    }
    this.options = {
      ...options,
      preload: options.preload ?? fromJSON,
    };
  }

  /**
   * Create a mutation factory, which returns a mutation object.
   * mutation is dispatchable.
   * The returns value will be used as the next state of the box.
   *
   * @param mutator
   * @param type
   */
  mutation<A extends any[]>(
    mutator: (state: S, ...args: A) => S,
    type?: string,
  ): MutationFactory<A, S> {
    if (process.env.NODE_ENV === 'development' && !type) {
      type = resolveCallerName();
    }
    const factory: MutationFactory<A, S> = Object.assign(
      (...args: A): Mutation<A, S> => ({
        $object: 'MUTATION',
        args,
        factory,
      }),
      {
        $object: 'MUTATION_FACTORY' as const,
        type,
        box: this,
        mutator,
      },
    );
    return factory;
  }

  /**
   * subscribe a signal
   *
   * @param signal
   * @param handler
   */
  subscribe<D>(signal: SignalFactory<any, D>, handler: (state: S, data: D) => S) {
    this.signals[signal.type] = handler;
  }

  /**
   * replace state with new state.
   *
   * @param nextState - the next state or its factory
   */
  setState = this.mutation((state, nextState: S | ((prevState: S) => S)) => {
    state = typeof nextState === 'function' ? (nextState as (prevState: S) => S)(state) : nextState;
    if (process.env.NODE_ENV === 'development') {
      warning(typeof state === 'function', 'state should not be a function.');
    }
    return state;
  }, `${this.key}/setState`);

  /**
   * merge state with partial props, it only works with object state.
   *
   * @param partialNextState - the partial next state properties or its factory
   */
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
