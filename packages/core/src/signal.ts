/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { identity } from './utils';

/**
 * An `Event` is a dispatchable object, which will notify all the subscribed
 * boxes to mutate these states when it is dispatched. The only way to create
 * an signal is calling the `EventFactory`, which is created by calling `signal()`
 * method.  You don't need to pay attention to any properties of the `Event`.
 *
 * The result of dispatch an `Event` is the data of the `Event`.
 *
 * @stable
 */
export interface Signal<D extends any = any> {
  $object: 'signal';
  type: string;
  data: D;
}

/**
 * An `EventFactory` is a function to create an `Event`, which is created by
 * `signal()` method.
 *
 * @stable
 */
export interface SignalFactory<A extends any[] = any, D = any> {
  $object: 'signal_factory';
  type: string;
  (...args: A): Signal<D>;
}

/**
 * Create an `EventFactory` without data.
 *
 * @param type An optional string to identify the type of the created signal.
 *
 * @stable
 */
export function signal(type: string): SignalFactory<[], void>;
/**
 * Create an `EventFactory` which creates an signal, whose value of the data
 * is the first parameter of calling `EventFactory`.
 *
 * @param type An optional string to identify the type of the created signal.
 *
 * @stable
 */
export function signal<D>(type: string): SignalFactory<[D], D>;
/**
 * Create an `EventFactory` which creates an signal, whose value of the data
 * is the return type of `creator`.
 *
 * @param creator a creator will be called with the same parameters when
 *                `EventFactory` is called.
 * @param type An optional string to identify the type of the created signal.
 *
 * @stable
 */
export function signal<A extends any[], D>(
  type: string,
  creator: (...args: A) => D,
): SignalFactory<A, D>;

export function signal(type: string, creator: any = identity): SignalFactory {
  return Object.assign(
    (...args: any[]): Signal => ({
      $object: 'signal',
      type,
      data: creator(...args),
    }),
    {
      $object: 'signal_factory' as const,
      type,
    },
  );
}
