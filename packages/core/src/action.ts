/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { applyEnhancers, resolveCallerName } from 'amos-utils';
import { AmosObject, Dispatch, Select } from './types';

export interface ActionOptions<A extends any[], R = any> {
  type?: string;
  conflictPolicy?: 'always' | 'first' | 'latest';
  conflictKey?: (select: Select, ...args: A) => string | number;
  rollback?: (select: Select, reason: unknown, ...args: A) => void;
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
      $amos: 'ACTION',
      args,
      factory,
    }),
    options,
    {
      $amos: 'ACTION_FACTORY' as const,
      actor,
    },
  );
  factory = applyEnhancers<ActionFactory<A, R>>(factory, actionEnhancers);
  return factory;
}

action.enhance = (enhancer: ActionEnhancer) => {
  actionEnhancers.push(enhancer);
};
