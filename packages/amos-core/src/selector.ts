/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { applyEnhancers, enhancerCollector, is, resolveCallerName } from 'amos-utils';
import { AmosObject, createAmosObject, Select } from './types';

/**
 * The options for a {@see SelectorFactory}.
 *
 * It could be extended by plugins.
 */
export interface SelectorOptions<A extends any[] = any, R = any> {
  /**
   * The type of the selector, used for devtools to print friendly names.
   * You do not need to pass this option, the library will generate the type
   * automatically when NODE_ENV is development.
   */
  type?: string;

  /**
   * The equal fn, which is used for check the result is updated or not. If the fn
   * returns true the new result will be ignored when compares the cached result and
   * new result.
   *
   * @param oldResult
   * @param newResult
   */
  equal?: (oldResult: R, newResult: R) => boolean;

  /**
   * The cache key of a selector created by the factory.
   *
   * If set, the selector's result will be cached. You should cache a selector if it is expensive.
   *
   * @param select
   * @param args
   */
  cacheKey?: (...args: A) => string | false;
}

export type Compute<A extends any[] = any, R = any> = (select: Select, ...args: A) => R;

/**
 * SelectorFactory is created by {@see selector}, it is used for create a {@see Selector}.
 *
 * A SelectorFactory is also selectable, when you select it, directly, its compute function
 * will get empty args.
 *
 * @example
 * const someSelector = selector((select, arg0) => arg0);
 * store.select(someSelector); // => undefined
 * store.select(someSelector(1)); // 1
 *
 * You do not need to care about the data structure of a SelectorFactory.
 */
export interface SelectorFactory<A extends any[] = any, R = any>
  extends AmosObject<'SELECTOR_FACTORY'> {
  (...args: A): Selector<A, R>;

  id: string;
  compute: Compute<A, R>;
  options: SelectorOptions<A, R>;
}

/**
 * Selector is created by {@see SelectorFactory}, it is used for select some state
 * in the {@see import('./createStore').Store}.
 *
 * You do not need to care about the data structure of a Selector.
 */
export interface Selector<A extends any[] = any, R = any> extends AmosObject<'SELECTOR'> {
  args: A;
  factory: SelectorFactory<A, R>;
}

export const enhanceSelector = enhancerCollector<[Compute, SelectorOptions], SelectorFactory>();

/**
 * Create a {@see SelectorFactory}, the factory is enhanced by enhancers.
 *
 * You can register enhancer by {@see selector.enhance}.
 *
 * @param compute
 * @param options
 */
export function selector<A extends any[], R>(
  compute: Compute<A, R>,
  options: SelectorOptions<A, R> = {},
): SelectorFactory<A, R> {
  if (process.env.NODE_ENV === 'development' && !options.type) {
    options.type = resolveCallerName();
  }
  options.equal ??= is;

  const factory = applyEnhancers(
    [compute, options],
    enhanceSelector.enhancers,
    (compute, options) => {
      return createAmosObject(
        'SELECTOR_FACTORY',
        Object.assign(
          (...args: A): Selector<A, R> =>
            createAmosObject('SELECTOR', {
              args,
              factory,
            }),
          { compute, options },
        ),
      );
    },
  );
  return factory;
}
