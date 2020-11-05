/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { Store } from './store';

export interface Action<R = any> {
  object: 'action';
  type: string | undefined;
  (store: Store): R;
}

export interface ActionFactory<A extends any[] = any[], R = any[]> {
  (...args: A): Action<R>;
}

export function action<A extends any[], R>(
  creator: (store: Store, ...args: A) => R,
  type?: string,
): ActionFactory<A, R> {
  return (...args: A): Action<R> => {
    return Object.assign((store: Store) => creator(store, ...args), {
      type,
      object: 'action',
    } as const);
  };
}
