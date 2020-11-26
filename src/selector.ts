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
export interface Selector<A extends any[] = any[], R = any> {
  object: 'selector';
  args: A;
  factory: SelectorFactory<A, R>;
}

/**
 * A `SelectorFactory` is a function to create a `Selector`.
 */
export interface SelectorFactory<A extends any[], R> {
  (...args: A): Selector<A, R>;
  object: 'selector_factory';
  type: string | undefined;
  fn: (select: Select, ...args: A) => R;
  deps: boolean | ((select: Select, ...args: A) => unknown[]);
  equalFn: (oldResult: R, newResult: R) => boolean;
}

/**
 * Create a `SelectorFactory`.
 *
 * @param fn the select function to select state
 * @param deps the deps function. If you do not specify a deps function, the
 *             `useSelector` (or `connect` in class) will automatically collect
 *             the state of the boxes that the selector depends on. If these
 *             states and the parameters of the selector have not changed, then
 *             the selector will not be recomputed. On the contrary, if you
 *             specify the deps function, then if the return value of this
 *             function does not change, the selector will not be executed. In
 *             most cases, you don’t need to specify the deps function, but if
 *             the state of a box that a selector depends on has attributes that
 *             are easy to update and are not dependent on this selector, and
 *             the execution of this selector takes a long time, then you can
 *             specify the deps function. In addition, if you set deps function
 *             as `false`, the selector will always be recomputed, ignores the
 *             args and dependents states.
 * @param equalFn the compare function, determines the selected result is
 *                updated or not, if it returns true, the component will
 *                rerender. The default compare function is strict equal (`===`).
 * @param type the optional type for display in react devtools
 *
 * @stable
 */
export function selector<A extends any[], R>(
  fn: (select: Select, ...args: A) => R,
  deps: ((select: Select, ...args: A) => unknown[]) | boolean = true,
  equalFn: (oldResult: R, newResult: R) => boolean = strictEqual,
  type?: string,
): SelectorFactory<A, R> {
  const factory: SelectorFactory<A, R> = Object.assign(
    (...args: A): Selector<A, R> => ({ object: 'selector', args, factory }),
    { deps, equalFn, type, fn, object: 'selector_factory' } as const,
  );
  return factory;
}
