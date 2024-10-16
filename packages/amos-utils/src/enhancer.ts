/*
 * @since 2022-01-06 18:58:06
 * @author junbao <junbao@moego.pet>
 */

import { Unsubscribe } from './types';
import { removeElement } from './misc';

export type Enhancer<A extends any[], V> = (next: (...args: A) => V) => (...args: A) => V;

export function applyEnhancers<A extends any[], V>(
  args: A,
  enhancers: Enhancer<A, V>[],
  factory: (...args: A) => V,
): V {
  return enhancers.reduceRight(
    (previousValue, currentValue) => currentValue(previousValue),
    factory,
  )(...args);
}

export interface EnhancerCollector<A extends any[], V> {
  (enhancer: Enhancer<A, V>): Unsubscribe;

  /** @internal */
  enhancers: Enhancer<A, V>[];
}

export function enhancerCollector<A extends any[], V>(): EnhancerCollector<A, V> {
  const enhancers: Enhancer<A, V>[] = [];
  return Object.assign(
    (e: Enhancer<A, V>) => {
      enhancers.push(e);
      return () => {
        removeElement(enhancers, e);
      };
    },
    {
      enhancers,
    },
  );
}

export function override<T, K extends keyof T>(obj: T, key: K, override: (original: T[K]) => T[K]) {
  obj[key] = override(obj[key]);
  return obj;
}
