/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { Store } from './store';

export interface Selector<R = any> {
  object: 'selector';
  (): R;
}

export interface SelectorFactory<A extends any[], R> {
  object: 'selector_factory';
  (...args: A): Selector<R>;
}

export function selector<A extends any[], R>(
  selector: (store: Store, ...args: A) => R,
  type?: string,
): SelectorFactory<A, R> {
  throw new Error('TODO');
}

export type MapSelector<Rs extends Selector[]> = {
  [P in keyof Rs]: Rs[P] extends Selector<infer R> ? R : never;
};

export function useSelector<Rs extends Selector[]>(
  ...selectors: Rs
): MapSelector<Rs> {
  throw new Error('TODO');
}
