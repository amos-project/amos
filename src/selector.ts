/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { Box } from './box';
import { Store } from './store';

export interface Selector<A extends any[] = any[], R = any, Bs extends Box[] = any[]> {
  object: 'selector';
  args: A;
  factory: SelectorFactory<A, R, Bs>;
}

export interface SelectorFactory<A extends any[] = any[], R = any, Ss extends any[] = any[]> {
  deps: Box[];
  lastValue?: R;
  lastKey?: unknown[];
  cacheKey?: (...args: [...Ss, Store, ...A]) => unknown[];
  selector: (...args: [...Ss, Store, ...A]) => R;
  (...args: A): Selector<A, R, Ss>;
}

export function selector<A extends any[], R>(
  selector: (store: Store, ...args: A) => R,
  cacheKey?: (store: Store, ...args: A) => unknown[],
): SelectorFactory<A, R, []>;
export function selector<S1, A extends any[], R>(
  box1: Box<S1>,
  selector: (store: Store, state: S1, ...args: A) => R,
  cacheKey?: (store: Store, state: S1, ...args: A) => unknown[],
): SelectorFactory<A, R, [S1]>;
export function selector<S1, S2, A extends any[], R>(
  box1: Box<S1>,
  box2: Box<S2>,
  selector: (store: Store, state1: S1, state2: S2, ...args: A) => R,
  cacheKey?: (store: Store, state1: S1, state2: S2, ...args: A) => unknown[],
): SelectorFactory<A, R, [S1, S2]>;
export function selector(...args: any[]): SelectorFactory {
  const fnIndex = args.findIndex((a) => typeof a === 'function');
  if (fnIndex === -1) {
    throw new Error(`[Moedux] selector is required`);
  }
  const deps = args.slice(0, fnIndex);
  const selector = args[fnIndex];
  const cacheKey = args[fnIndex + 1];
  const factory = Object.assign(
    (...args: any[]): Selector => ({
      object: 'selector',
      args,
      factory,
    }),
    { deps, selector, cacheKey },
  );
  return factory;
}
