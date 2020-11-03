/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { Store } from './store';

export interface Action<R = any> {
  object: 'action';
  type: string;
  payload: () => R;
}

export interface ActionFactory<A extends any[], R> {
  object: 'action_factory';
  (...args: A): Action<R>;
}

export function action<A extends any[], R>(
  actor: (store: Store, ...args: A) => R,
  type?: string,
): ActionFactory<A, R> {
  throw new Error('TODO');
}
