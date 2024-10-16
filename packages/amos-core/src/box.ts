/*
 * @since 2020-11-03 16:25:01
 * @author acrazing <joking.young@gmail.com>
 */

import {
  clone,
  Constructor,
  Mutable,
  NotImplemented,
  resolveCallerName,
  resolveFnValue,
  threw,
  ValueOrFactory,
  WellPartial,
} from 'amos-utils';
import { SignalFactory } from './signal';
import { AmosObject, createAmosObject } from './types';

export interface Mutation<A extends any[] = any, S = any> extends AmosObject<'MUTATION'> {
  type: string;
  args: A;
  box: Box<S>;
  mutator: (this: Box<S>, state: S, ...args: A) => S;
}

export type MutationFactory<A extends any[], S> = (this: Box<S>, ...args: A) => Mutation<A, S>;

export interface BoxOptions<S> {}

export class Box<S = any> {
  readonly options: BoxOptions<S>;

  /**
   * create a box instance
   *
   * @param key - the unique key of the box, it should be unique in your system
   * @param initialState - the initial state of the box, it should not be a function
   */
  constructor(
    readonly key: string,
    readonly initialState: S,
  ) {
    if (process.env.NODE_ENV === 'development') {
      threw(typeof initialState === 'function', 'initialState should not be a function.');
    }
    this.options = {};
  }

  /**
   * Update the options of the box.
   * @param options
   * TThis is TS2344: Type 'RecordMapBox<any>' does not satisfy the constraint 'Box<any>'. The
   *   types returned by 'resetInitialState(...)' are incompatible between these types.
   *   Property 'relations' is missing in type 'MapBox<any>' but required in type
   *   'RecordMapBox<any>'.
   */
  config<TThis extends Box<S>>(this: TThis, options: Partial<BoxOptions<S>>): TThis {
    Object.assign(this.options, options);
    return this;
  }

  setInitialState<TThis extends Box<S>>(this: TThis, state: ValueOrFactory<S, [S]>): TThis {
    (this as Mutable<TThis>).initialState = resolveFnValue(state, this.initialState);
    return this;
  }

  /**
   * subscribe a signal
   *
   * @param signal
   * @param handler
   */
  subscribe<TThis extends Box<S>, D>(
    this: TThis,
    signal: SignalFactory<any, D>,
    handler: (state: S, data: D) => S,
  ): TThis {
    signal.listeners.set(this, handler);
    return this;
  }

  /**
   * replace state with new state.
   *
   * @param nextState - the next state or its transformer
   */
  setState(nextState: ValueOrFactory<S, [S]>): Mutation<[ValueOrFactory<S, [S]>], S> {
    throw new NotImplemented();
  }

  /**
   * merge state with partial props, it only works with object state.
   *
   * @param partialNextState - the partial next state properties or its factory
   */
  mergeState(partialNextState: ValueOrFactory<WellPartial<S>, [S]>): Mutation<[WellPartial<S>], S> {
    throw new NotImplemented();
  }

  /**
   * Reset state to the initial state.
   */
  resetState(): Mutation<[], S> {
    throw new NotImplemented();
  }
}

export type BoxState<B extends Box> = B extends Box<infer S> ? S : never;

export function mutation<S, A extends any[]>(
  box: Box<S>,
  mutator: (state: S, ...args: A) => S,
  type?: string,
): MutationFactory<A, S> {
  if (!type && process.env.NODE_ENV === 'development') {
    type = resolveCallerName();
  }
  return (...args: A) => createAmosObject('MUTATION', { type: type!, box, args, mutator });
}

/**
 * implementation the mutations & selectors for a box.
 * @param box
 * @param mutations
 * @param selectors
 * @param methods
 * TODO: implement selectors
 */
export function implementation<B extends Box>(
  box: Constructor<B, any[]>,
  mutations: {
    [P in keyof B]?: B[P] extends (...args: infer A) => Mutation<infer A, BoxState<B>>
      ? (state: BoxState<B>, ...args: A) => BoxState<B>
      : null;
  },
  selectors: {
    [P in keyof B]?: B[P] extends (...args: infer A) => infer R
      ? (state: BoxState<B>, ...args: A) => R
      : null;
  },
  methods?: Partial<B>,
) {
  for (const k in mutations) {
    const mutator =
      typeof mutations[k] === 'function'
        ? mutations[k]
        : (state: any, ...args: any[]) => state[k](...args);
    (Box.prototype as any)[k] = function (...args: any[]) {
      return createAmosObject('MUTATION', { k, args, mutator, box: this });
    };
  }
  Object.assign(Box.prototype, mutations, selectors, methods);
}

implementation(
  Box,
  {
    setState: <S>(state: S, nextState: ValueOrFactory<S, [S]>) => resolveFnValue(nextState, state),
    mergeState: <S>(state: S, partialNextState: ValueOrFactory<WellPartial<S>, [S]>) => {
      return clone(state, resolveFnValue(partialNextState, state));
    },
    resetState: function () {
      return this.initialState;
    },
  },
  {},
);
