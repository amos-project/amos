/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { applyEnhancers } from '../../utils/src/enhancer';
import { strictEqual } from '../../utils/src/equals';
import { AmosObject, Select } from './types';
import { resolveCallerName } from '../../utils/src/misc';

/**
 * Selector is created by {@see SelectorFactory}, it is used for select some state
 * in the {@see import('./store').Store}.
 *
 * You do not need to care about the data structure of a Selector.
 */
export interface Selector<A extends any[] = any, R = any> extends AmosObject<'SELECTOR'> {
  args: A;
  factory: SelectorFactory<A, R>;
}

/**
 * A function is also selectable.
 *
 * Please note that the selection result of a function will not be cached.
 * If used in {@see import('amos-react').useSelector}, it will always be
 * recomputed when the state of the store changes. Therefore, you MUST
 * ensure that the calculation is lightweight and the result of the
 * calculation is strict equal when the state has not changed.
 */
export interface FunctionSelector<R> {
  type?: string;
  (select: Select): R;
}

/**
 * The options for a {@see SelectorFactory}.
 *
 * It could be extended by plugins.
 */
export interface SelectorOptions<A extends any[], R> {
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
   * If set, the selector's result will be cached. You should cache a selector
   * if it is expensive, or it is always changed even if its dependencies is
   * not changed.
   *
   * @param select
   * @param args
   */
  cacheKey?: (...args: A) => string | false;
}

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
  extends AmosObject<'SELECTOR_FACTORY'>,
    SelectorOptions<A, R> {
  id: string;
  compute: (select: Select, ...args: A) => R;
  (...args: A): Selector<A, R>;
}

/**
 * SelectorEnhancer is a function to reshape a {@see SelectorFactory}.
 *
 * It could be registered by {@see selector.enhance} and it is applied
 * when a {@see selector} is called.
 */
export type SelectorEnhancer = <A extends any[], R>(
  factory: SelectorFactory<A, R>,
) => SelectorFactory<A, R>;

const selectorEnhancers: SelectorEnhancer[] = [];

/**
 * Create a {@see SelectorFactory}, the factory is enhanced by enhancers.
 *
 * You can register enhancer by {@see selector.enhance}.
 *
 * @param compute
 * @param options
 */
export function selector<A extends any[], R>(
  compute: (select: Select, ...args: A) => R,
  options: SelectorOptions<A, R> = {},
): SelectorFactory<A, R> {
  if (process.env.NODE_ENV === 'development' && !options.type) {
    options.type = resolveCallerName();
  }

  let factory: SelectorFactory<A, R> = Object.assign(
    (...args: A): Selector<A, R> => ({ $amos: 'SELECTOR', args, factory }),
    {
      ...options,
      equal: options.equal || strictEqual,
    },
    {
      $amos: 'SELECTOR_FACTORY',
      id: Math.random().toString().substr(2),
      compute,
    } as const,
  );
  factory = applyEnhancers<SelectorFactory<A, R>>(factory, selectorEnhancers);
  return factory;
}

/**
 * Register a  {@see SelectorEnhancer}.
 *
 * @param enhancer
 */
selector.enhance = (enhancer: SelectorEnhancer) => {
  selectorEnhancers.push(enhancer);
};

selector.enhancers = selectorEnhancers;
