/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { Select } from './store';
import { strictEqual } from './utils';

export interface FunctionSelector<R> {
  (select: Select): R;
  type?: string;
}

/**
 * A `Selector` is a selectable function, the result of select it is the reutrn
 * value of the selector.
 *
 * You can create a selector by define a function directly, or by calling
 * `SelectorFactory`, which is created by the `selector` method.
 *
 * @stable
 */
export interface Selector<A extends any[] = any, R = any> {
  $object: 'selector';
  args: A;
  factory: SelectorFactory<A, R>;
}

/**
 * A `SelectorFactory` is a function to create a `Selector`.
 */
export interface SelectorFactory<A extends any[] = any, R = any> {
  $object: 'selector_factory';
  (...args: A): Selector<A, R>;
  type: string | undefined;
  compute: (select: Select, ...args: A) => R;
  cacheStrategy: boolean | ((select: Select, ...args: A) => unknown[]);
  equalFn: (oldResult: R, newResult: R) => boolean;
}

/**
 * @param compute the function to get the result
 * @param cacheStrategy the deps, if is false, the selector will always recompute
 * @param equalFn
 * @param type
 */
export function selector<A extends any[], R>(
  compute: (select: Select, ...args: A) => R,
  cacheStrategy: boolean | ((select: Select, ...args: A) => unknown[]) = false,
  equalFn: (oldResult: R, newResult: R) => boolean = strictEqual,
  type?: string,
): SelectorFactory<A, R> {
  const factory: SelectorFactory<A, R> = Object.assign(
    (...args: A): Selector<A, R> => ({ $object: 'selector', args, factory }),
    {
      $object: 'selector_factory',
      compute,
      cacheStrategy,
      equalFn,
      type,
    } as const,
  );
  return factory;
}
