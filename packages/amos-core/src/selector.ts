/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import {
  AmosObject,
  createAmosObject,
  enhancerCollector,
  ID,
  is,
  ValueOrReadonlyArray,
} from 'amos-utils';
import { Box } from './box';
import { Select } from './types';

/**
 * A function to derive state from a store.
 */
export type Compute<A extends any[] = any, R = any> = (select: Select, ...args: A) => R;

export interface SelectorOptions<A extends any[] = any, R = any> {
  /**
   * The type of the selector.
   */
  type: string;

  /**
   * The equal fn, which is used for check the result is updated or not. If the fn
   * returns true the new result will be ignored when compares the cached result and
   * new result. Default is {@link Object.is}.
   */
  equal: (oldResult: R, newResult: R) => boolean;

  /**
   * Should cache the selector or not, you should set this flag to true if the selector
   * is expensive.
   *
   * Please note {@link equal} will still work even if this flag is false when you select
   * state in react with {@link useSelector}.
   */
  cache?: boolean;

  /**
   * Is this selector loading a box's row? Used for persist module to determine load which row
   * for multi-row state box.
   *
   * @see BoxOptions.table
   */
  loadRow?: (...args: A) => ValueOrReadonlyArray<readonly [Box, ID]>;
}

/**
 * Selector is created by {@link SelectorFactory}, or {@link BoxFactoryOptions.selectors}
 * methods. It is {@link Selectable} and used for derive state from a {@link Store}.
 *
 * You should not create a Selector manually and do not need to care about the data structure
 * of it.
 */
export interface Selector<A extends any[] = any, R = any>
  extends AmosObject<'selector'>,
    SelectorOptions<A, R> {
  /**
   * The args of the selector, which is used for {@link SelectorOptions.loadRow} and
   * {@link withDevtools} to display args.
   */
  readonly args: A;
  /**
   * Derive the state method, which is a bound function from {@link Compute}.
   */
  readonly compute: (select: Select) => R;
}

/**
 * A selector factory is created by {@link selector} and is used to create {@link Selector}.
 */
export interface SelectorFactory<A extends any[] = any, R = any>
  extends AmosObject<'selector_factory'> {
  type: string;
  (...args: A): Selector<A, R>;
}

/**
 * Enhance {@link selector} function to empower {@link SelectorFactory}.
 *
 * Please note the enhancers have a global scope and static. You should register your
 * enhancer before create any selector.
 *
 * @see SelectableActionFactory
 * @see enhanceAction
 * @example
 * // print args when the selector is computed.
 * enhanceSelector((next) => (compute, options) => next((select, ...args) => {
 *   console.log('args', args);
 *   return compute(select, ...args);
 * }, options));
 */
export const enhanceSelector = enhancerCollector<[Compute, SelectorOptions], SelectorFactory>();

/**
 * Create a {@link SelectorFactory} with options. A {@link SelectorFactory} is used for
 * create a {@link Selector}. which is a {@link Selectable} object that can be used to
 * derive a value from the state.
 *
 * Please note any call to this method will apply enhancers registered with
 * {@link enhanceSelector}.
 */
export function selector<A extends any[], R>(
  compute: Compute<A, R>,
  options: Partial<SelectorOptions<A, R>> = {},
): SelectorFactory<A, R> {
  const finalOptions = { ...options } as SelectorOptions;
  finalOptions.type ??= '';
  finalOptions.equal ??= is;
  return enhanceSelector.apply([compute, finalOptions], (compute, options) => {
    const factory = createAmosObject<SelectorFactory>(
      'selector_factory',
      Object.assign(
        (...args: A) => {
          return createAmosObject<Selector<A, R>>('selector', {
            ...options,
            compute: (select) => compute(select, ...args),
            id: factory.id,
            args,
          });
        },
        {
          type: finalOptions.type,
        },
      ) as SelectorFactory<A, R>,
    );
    return factory;
  });
}
