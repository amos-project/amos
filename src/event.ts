/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { identity } from './utils';

export interface Event<T> {
  object: 'event';
  type: string | undefined;
  factory: EventFactory<any[], T>;
  data: T;
}

export interface EventFactory<A extends any[], T> {
  (...args: A): Event<T>;
}

export function event<T>(type?: string): EventFactory<[], T>;
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
