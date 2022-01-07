/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { applyEnhancers, resolveCallerName } from 'amos-utils';
import { AmosObject, Dispatch, Select } from './types';

export interface ActionOptions<A extends any[], R = any> {
  /**
   * The key for avoid duplicate async dispatch.
   *
   * If not set, the dispatch will always be executed, else the duplicated
   * dispatch will be ignored.
   *
   * @example
   * const getUserWithKey = action(async (dispatch, select, userId: number) => {
   *   await fetchUserSomewhere(userId);
   * }, {
   *   key: (select, userId) => userId,
   * });
   *
   * const getUserWithoutKey = action(async (dispatch, select, userId: number) => {
   *   await fetchUserSomewhere(userId);
   * });
   *
   * // the following dispatch will only be dispatched once (the second one is ignored).
   * store.dispatch(getUserWithKey(1));
   * store.dispatch(getUserWithKey(1));
   *
   * // and the everyone of the following dispatch will be dispatched.
   * store.dispatch(getUserWithKey(1));
   * // different key
   * await store.dispatch(getUserWithKey(2));
   * // the upon one is finished
   * store.dispatch(getUserWithKey(2));
   * store.dispatch(getUser(1));
   * // without key
   * store.dispatch(getUser(1));
   *
   * @param select
   * @param args
   */
  key?: (select: Select, ...args: A) => string | number;
  type?: string;
}

export interface ActionFactory<A extends any[] = any, R = any>
  extends AmosObject<'ACTION_FACTORY'>,
    ActionOptions<A, R> {
  (...args: A): Action<A, R>;
  actor: (dispatch: Dispatch, select: Select, ...args: A) => R;
}

export interface Action<A extends any[] = any, R = any> extends AmosObject<'ACTION'> {
  args: A;
  factory: ActionFactory<A, R>;
}

export type ActionEnhancer = <A extends any[], R>(
  factory: ActionFactory<A, R>,
) => ActionFactory<A, R>;

const actionEnhancers: ActionEnhancer[] = [];

/**
 * create an action factory.
 *
 * action factory is a function to create an action object, with is dispatchable.
 *
 * @param actor
 * @param options
 */
export function action<A extends any[], R>(
  actor: (dispatch: Dispatch, select: Select, ...args: A) => R,
  options: ActionOptions<A, R> = {},
): ActionFactory<A, R> {
  if (process.env.NODE_ENV === 'development' && !options.type) {
    options.type = resolveCallerName();
  }
  let factory: ActionFactory<A, R> = Object.assign(
    (...args: A): Action<A, R> => ({
      $object: 'ACTION',
      args,
      factory,
    }),
    options,
    {
      $object: 'ACTION_FACTORY' as const,
      actor,
    },
  );
  factory = applyEnhancers<ActionFactory<A, R>>(factory, actionEnhancers);
  return factory;
}

action.enhance = (enhancer: ActionEnhancer) => {
  actionEnhancers.push(enhancer);
};
