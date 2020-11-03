/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { Dispatch, Store } from './store';

export interface Action<A extends any[] = any[], R = any> {
  object: 'action';
  args: A;
  factory: ActionFactory<A, R>;
}

export interface ActionFactory<A extends any[] = any[], R = any[]> {
  type: string;
  action: (store: Store, dispatch: Dispatch, ...args: A) => R;
  (...action: A): Action<A, R>;
}

export function action<A extends any[], R>(
  action: (store: Store, dispatch: Dispatch, ...args: A) => R,
  type: string = action.name,
): ActionFactory<A, R> {
  const factory = Object.assign(
    (...args: A): Action<A, R> => ({
      object: 'action',
      args,
      factory,
    }),
    { type, action },
  );
  return factory;
}
