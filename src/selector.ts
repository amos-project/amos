/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { Select } from './store';

/**
 * A `Selector` is a selectable function, the result of select it is the reutrn
 * value of the selector.
 *
 * You can create a selector by define a function directly, or by calling
 * `SelectorFactory`, which is created by the `selector` method.
 *
 * @stable
 */
export interface Selector<R = any, A extends any[] = any[]> {
  (select: Select): R;
  /** @internal */
  deps?: false | ((select: Select, ...args: A) => unknown[]);
  /** @internal */
  compare?: (oldResult: R, newResult: R) => boolean;
  /** @internal */
  factory?: SelectorFactory<A, R>;
  /** @internal */
  args?: A;
}

/**
 * A `SelectorFactory` is a function to create a `Selector`.
 */
export interface SelectorFactory<A extends any[], R> {
  (...args: A): Selector<R, A>;
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
 * @param compare the compare function, determines the selected result is
 *                updated or not, if it returns true, the component will
 *                rerender. The default compare function is strict equal (`===`).
 *
 * @stable
 */
export function selector<A extends any[], R>(
  fn: (select: Select, ...args: A) => R,
  deps?: false | ((select: Select, ...args: A) => unknown[]),
  compare?: (oldResult: R, newResult: R) => boolean,
): SelectorFactory<A, R> {
  const factory: SelectorFactory<A, R> = (...args) => {
    const selector: Selector<R, A> = (select) => fn(select, ...args);
    selector.deps = deps;
    selector.compare = compare;
    selector.factory = factory;
    selector.args = args;
    return selector;
  };
  return factory;
}
