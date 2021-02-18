/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { Select } from './store';
import { strictEqual, uid } from './utils';

export interface FunctionSelector<R> {
  type?: string;
  (select: Select): R;
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

export type CacheStrategy<A extends any[]> =
  | false /* no cache */
  | true /* cache with args.join(',') */
  | ((...args: A) => string); /* cache with custom key generator */

/**
 * A `SelectorFactory` is a function to create a `Selector`.
 */
export interface SelectorFactory<A extends any[] = any, R = any> {
  readonly $object: 'selector_factory';
  readonly id: number;
  readonly type: string | undefined;
  readonly compute: (select: Select, ...args: A) => R;
  readonly cacheStrategy: CacheStrategy<A>;
  readonly equalFn: (oldResult: R, newResult: R) => boolean;
  (...args: A): Selector<A, R>;
}

/**
 * create a selector factory
 *
 * @param compute     The function to compute the value
 * @param cacheStrategy   Should cache the value or not.
 *                    If true, the value of the selector will be cached in a selector
 *                    factory and args tree. The cache will be invalidated when the
 *                    state of the box it depends on is mutated.
 * @param equalFn     The compare function, which is used to detect the value is same
 *                    or not, which is used in react.
 * @param type        The type of the selector, for better develop experience in devtools,
 *                    which could be injected by the compiler plugins.
 */
export function selector<A extends any[], R>(
  compute: (select: Select, ...args: A) => R,
  cacheStrategy: CacheStrategy<A> = false,
  equalFn: (oldResult: R, newResult: R) => boolean = strictEqual,
  type?: string,
): SelectorFactory<A, R> {
  const factory: SelectorFactory<A, R> = Object.assign(
    (...args: A): Selector<A, R> => ({ $object: 'selector', args, factory }),
    {
      $object: 'selector_factory',
      id: uid(),
      compute,
      cacheStrategy,
      equalFn,
      type,
    } as const,
  );
  return factory;
}
