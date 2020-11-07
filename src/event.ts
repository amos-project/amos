/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { identity } from './utils';

/**
 * An `Event` is a dispatchable object, which will notify all the subscribed
 * boxes to mutate these states when it is dispatched. The only way to create
 * an event is calling the `EventFactory`, which is created by calling `event()`
 * method.  You don't need to pay attention to any properties of the `Event`.
 *
 * The result of dispatch an `Event` is the data of the `Event`.
 *
 * @stable
 */
export interface Event<T> {
  object: 'event';
  type: string | undefined;
  factory: EventFactory<any[], T>;
  data: T;
}

/**
 * An `EventFactory` is a function to create an `Event`, which is created by
 * `event()` method.
 *
 * @stable
 */
export interface EventFactory<A extends any[], T> {
  (...args: A): Event<T>;
}

/**
 * Create an `EventFactory` without data.
 *
 * @param type An optional string to identify the type of the created event.
 *
 * @stable
 */
export function event(type?: string): EventFactory<[], void>;
/**
 * Create an `EventFactory` which creates an event, whose value of the data
 * is the first parameter of calling `EventFactory`.
 *
 * @param type An optional string to identify the type of the created event.
 *
 * @stable
 */
export function event<T>(type?: string): EventFactory<[T], T>;
/**
 * Create an `EventFactory` which creates an event, whose value of the data
 * is the return type of `creator`.
 *
 * @param creator a creator will be called with the same parameters when
 *                `EventFactory` is called.
 * @param type An optional string to identify the type of the created event.
 *
 * @stable
 */
export function event<A extends any[], T>(
  creator: (...args: A) => T,
  type?: string,
): EventFactory<A, T>;
export function event(a?: any, b?: any): EventFactory<any[], any> {
  const creator = typeof a === 'function' ? a : identity;
  const type = typeof a === 'function' ? b : a;
  const factory: EventFactory<any, any> = (...args: any[]) => ({
    object: 'event',
    type,
    factory,
    data: creator(...args),
  });
  return factory;
}
