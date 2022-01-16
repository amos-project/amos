/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { applyEnhancers, identity } from 'amos-utils';
import { AmosObject } from './types';

/**
 * An `Signal` is a dispatchable object, which will notify all the subscribed
 * boxes to mutate these states when it is dispatched. The only way to create
 * an signal is calling the `SignalFactory`, which is created by calling `signal()`
 * method.  You don't need to pay attention to any properties of the `Signal`.
 *
 * The return value of `dispatch(signal)` is the data of the signal.
 */
export interface Signal<D extends any = any> extends AmosObject<'SIGNAL'> {
  type: string;
  data: D;
}

export interface SignalOptions<D> {}

/**
 * An `SignalFactory` is a function to create an `Signal`, which is created by
 * `signal()` method.
 */
export interface SignalFactory<A extends any[] = any, D = any>
  extends AmosObject<'SIGNAL_FACTORY'>,
    SignalOptions<D> {
  type: string;
  (...args: A): Signal<D>;
}

export type SignalEnhancer = <A extends any[], D>(
  factory: SignalFactory<A, D>,
) => SignalFactory<A, D>;

const signalEnhancers: SignalEnhancer[] = [];

/**
 * Create an `SignalFactory` which creates an signal, whose value of the data
 * is the return type of `creator`.
 *
 * @param creator a creator will be called with the same parameters when
 *                `SignalFactory` is called.
 * @param type An optional string to identify the type of the created signal.
 * @param options
 */
export function signal<A extends any[], D>(
  type: string,
  creator: (...args: A) => D,
  options?: SignalOptions<D>,
): SignalFactory<A, D>;
/**
 * Create an `SignalFactory` without data.
 *
 * @param type An optional string to identify the type of the created signal.
 * @param options
 */
export function signal(type: string, options?: SignalOptions<void>): SignalFactory<[], void>;
/**
 * Create an `SignalFactory` which creates an signal, whose value of the data
 * is the first parameter of calling `SignalFactory`.
 *
 * @param type An optional string to identify the type of the created signal.
 * @param options
 */
export function signal<D>(type: string, options?: SignalOptions<D>): SignalFactory<[D], D>;
export function signal(type: string, creator: any, options?: any): SignalFactory {
  if (typeof creator === 'object') {
    options = creator;
    creator = void 0;
  }
  creator ??= identity;
  let factory: SignalFactory = Object.assign(
    (...args: any[]): Signal => ({
      $amos: 'SIGNAL',
      type,
      data: creator(...args),
    }),
    options,
    {
      $amos: 'SIGNAL_FACTORY' as const,
      type,
    },
  );
  factory = applyEnhancers(factory, signalEnhancers);
  return factory;
}

signal.enhance = (enhancer: SignalEnhancer) => {
  signalEnhancers.push(enhancer);
};
