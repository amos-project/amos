/*
 * @since 2020-11-03 16:25:01
 * @author acrazing <joking.young@gmail.com>
 */

import { clone } from 'amos-utils';
import { resolveCallerName, threw, warning } from '../../utils/src/misc';
import { Selector, selector, SelectorOptions } from './selector';
import { SignalFactory } from './signal';
import { AmosObject, createAmosObject } from './types';

export interface Mutation<A extends any[] = any, S = any> extends AmosObject<'MUTATION'> {
  type: string;
  args: A;
  box: Box<S>;
  mutator: (state: S, ...args: A) => S;
}

export interface BoxOptions<S> {}

export class Box<S = any> {
  readonly signals: Record<string, (state: S, data: any) => S> = {};

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
  }, 'SET_STATE');

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
    'MERGE_STATE',
  );

  /**
   * Reset state to the initial state.
   */
  resetState = this.mutation(() => this.initialState, 'RESET_STATE');

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
  }

  selector<A extends any[], R>(
    computer: (state: S, ...args: A) => R,
    options?: SelectorOptions<A, R>,
  ): (...args: A) => Selector<A, R>;
  selector<T>(key: keyof S): T;
  selector(a?: any, b: any = {}) {
    if (typeof a === 'string') {
      b.type ??= a;
      return selector((select, ...args: any) => (select(this) as any)[a](...args), b);
    }
    const computer = a;
    const options = b;
    if (process.env.NODE_ENV === 'development' && !options.type) {
      options.type = resolveCallerName();
    } else {
      options.type = 'ANONYMOUS';
    }
    return selector((select, ...args: any) => computer(select(this), ...args), options);
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
  ): (...args: A) => Mutation<A, S>;
  mutation<T>(key: keyof S): T;
  mutation(a: any, type?: string) {
    if (typeof a === 'string') {
      return this.mutation((state: any, ...args: any) => state[a](...args), a);
    }
    if (process.env.NODE_ENV === 'development' && !type) {
      type = resolveCallerName();
    } else {
      type = 'ANONYMOUS';
    }
    const mutator = a;
    return (...args: any) =>
      createAmosObject('MUTATION', {
        mutator,
        type: type!,
        args,
        box: this,
      });
  }

  /**
   * subscribe a signal
   *
   * @param signal
   * @param handler
   */
  subscribe<D>(signal: SignalFactory<any, D>, handler: (state: S, data: D) => S): this {
    this.signals[signal.type] = handler;
    return this;
  }
}
