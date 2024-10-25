/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import {
  AmosObject,
  createAmosObject,
  createEventCenter,
  enhancerCollector,
  EventCenter,
  second,
} from 'amos-utils';
import { Dispatch, Select } from './types';

export type Creator<A extends any[] = any, D = any> = (select: Select, ...args: A) => D;

export interface SignalOptions<A extends any[] = any, D = any> {
  type: string;
  creator: Creator<A, D>;
}

export interface Signal<A extends any[] = any, D = any>
  extends AmosObject<'signal'>,
    SignalOptions<A, D> {
  args: A;
  factory: SignalFactory<any, D>;
}

export interface SignalFactory<A extends any[] = any, D = any>
  extends EventCenter<[dispatch: Dispatch, select: Select, data: D]> {
  (...args: A): Signal<A, D>;
}

export const enhanceSignal = enhancerCollector<[SignalOptions], SignalFactory>();

/**
 * Create an {@link SignalFactory} which creates a {@link Signal}, whose value of the data
 * is the return value of `creator`.
 *
 * {@link Signal} is dispatchable.
 */
export function signal<A extends any[], D>(
  type: string,
  creator: Creator<A, D>,
  options?: Partial<SignalOptions<A, D>>,
): SignalFactory<A, D>;
/**
 * Create an `SignalFactory` without data.
 */
export function signal(
  type: string,
  options?: Partial<SignalOptions<[], void>>,
): SignalFactory<[], void>;
/**
 * Create an `SignalFactory` which creates an signal, whose value of the data
 * is the first parameter of calling `SignalFactory`.
 */
export function signal<D>(
  type: string,
  options?: Partial<SignalOptions<[D], D>>,
): SignalFactory<[D], D>;
export function signal(a: any, b?: any, c?: any): SignalFactory {
  const bIsFunc = typeof b === 'function';
  const options: SignalOptions = (bIsFunc ? c : b) || {};
  options.type = a;
  options.creator = (bIsFunc && b) || second;
  const factory = enhanceSignal.apply([options as SignalOptions], (options) => {
    return Object.assign((...args: any[]) => {
      return createAmosObject<Signal>('signal', {
        ...options,
        args: args,
        factory: factory,
      });
    }, createEventCenter());
  });
  return factory;
}
