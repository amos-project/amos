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

export type Compute<A extends any[] = any, R = any> = (select: Select, ...args: A) => R;

export interface SelectorOptions<A extends any[] = any, R = any> {
  type: string;
  compute: Compute<A, R>;

  /**
   * The equal fn, which is used for check the result is updated or not. If the fn
   * returns true the new result will be ignored when compares the cached result and
   * new result. Default is {@link Object.is}
   */
  equal: (oldResult: R, newResult: R) => boolean;

  /**
   * Should cache the selector or not, you should set this flag to true if the selector
   * is expensive.
   */
  cache?: boolean;

  /**
   * Is this selector loading a box's row? Used for persist module to determine load which row
   * for multi-row state box.
   * @param args
   */
  loadRow?: (...args: A) => ValueOrReadonlyArray<readonly [Box, ID]>;
}

/**
 * Selector is created by {@link SelectorFactory}, it is used for select some state
 * in the {@link import('./store').Store}.
 *
 * You do not need to care about the data structure of a Selector.
 */
export interface Selector<A extends any[] = any, R = any>
  extends AmosObject<'selector'>,
    SelectorOptions<A, R> {
  args: A;
}

export interface SelectorFactory<A extends any[] = any, R = any>
  extends AmosObject<'selector_factory'> {
  (...args: A): Selector<A, R>;
}

export const enhanceSelector = enhancerCollector<[SelectorOptions], SelectorFactory>();

export function selector<A extends any[], R>(
  compute: Compute<A, R>,
  options: Partial<SelectorOptions<A, R>> = {},
): SelectorFactory<A, R> {
  const finalOptions = { ...options } as SelectorOptions;
  finalOptions.type ??= '';
  finalOptions.equal ??= is;
  finalOptions.compute = compute;
  return enhanceSelector.apply([finalOptions], (options) => {
    const factory = createAmosObject<SelectorFactory>('selector_factory', ((...args: A) => {
      return createAmosObject<Selector<A, R>>('selector', {
        ...options,
        id: factory.id,
        args,
      });
    }) as SelectorFactory<A, R>);
    return factory;
  });
}
