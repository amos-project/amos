/*
 * @since 2022-01-06 18:58:06
 * @author junbao <junbao@moego.pet>
 */

import { removeElement } from './misc';
import { Unsubscribe } from './types';

export type Enhancer<A extends any[], V> = (next: (...args: A) => V) => (...args: A) => V;

export function applyEnhancers<A extends any[], V>(
  enhancers: Enhancer<A, V>[],
  args: NoInfer<A>,
  factory: (...args: NoInfer<A>) => NoInfer<V>,
): V {
  return enhancers
    .slice()
    .reduceRight((previousValue, currentValue) => currentValue(previousValue), factory)(...args);
}

export interface EnhancerCollector<A extends any[], V> {
  (enhancer: Enhancer<A, V>): Unsubscribe;
  apply: (args: A, factory: (...args: A) => V) => V;
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
      apply: (args: A, factory: (...args: A) => V) => applyEnhancers(enhancers, args, factory),
    },
  );
}

export function override<T, K extends keyof T>(obj: T, key: K, override: (original: T[K]) => T[K]) {
  obj[key] = override(obj[key]);
}
