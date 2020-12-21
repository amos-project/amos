/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { Select } from './store';
import { AmosObject, defineAmosObject, strictEqual } from './utils';

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
export interface Selector<A extends any[] = any[], R = any> extends AmosObject<'selector'> {
  args: A;
  factory: SelectorFactory<A, R>;
}

/**
 * A `SelectorFactory` is a function to create a `Selector`.
 */
export interface SelectorFactory<A extends any[] = any, R = any>
  extends AmosObject<'selector_factory'> {
  (...args: A): Selector<A, R>;
  type: string | undefined;
  calc: (select: Select, ...args: A) => R;
  cache: boolean;
  equalFn: (oldResult: R, newResult: R) => boolean;
}

/**
 * @param calc the function to get the result
 * @param cache the deps, if is false, the selector will always recompute
 * @param equalFn
 * @param type
 */
export function selector<A extends any[], R>(
  calc: (select: Select, ...args: A) => R,
  cache = false,
  equalFn: (oldResult: R, newResult: R) => boolean = strictEqual,
  type?: string,
): SelectorFactory<A, R> {
  const factory: SelectorFactory<A, R> = defineAmosObject(
    'selector_factory',
    Object.assign((...args: A): Selector<A, R> => defineAmosObject('selector', { args, factory }), {
      cache,
      equalFn,
      type,
      calc,
    } as const),
  );
  return factory;
}
