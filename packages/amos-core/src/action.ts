/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { applyEnhancers, enhancerCollector, resolveCallerName } from 'amos-utils';
import { AmosObject, createAmosObject, Dispatch, Select } from './types';

export interface ActionOptions<A extends any[] = any, R = any> {
  type?: string;
  conflictPolicy?: 'always' | 'first' | 'latest';
  conflictKey?: (select: Select, ...args: A) => string | number;
  rollback?: (select: Select, reason: unknown, ...args: A) => void;
}

export type Actor<A extends any[] = any, R = any> = (
  dispatch: Dispatch,
  select: Select,
  ...args: A
) => R;

export interface ActionFactory<A extends any[] = any, R = any>
  extends AmosObject<'ACTION_FACTORY'> {
  (...args: A): Action<A, R>;

  actor: Actor<A, R>;
  options: ActionOptions<A, R>;
}

export interface Action<A extends any[] = any, R = any> extends AmosObject<'ACTION'> {
  args: A;
  factory: ActionFactory<A, R>;
}

export const enhanceAction = enhancerCollector<[Actor, ActionOptions], ActionFactory>();

/**
 * create an action factory.
 *
 * action factory is a function to create an action object, with is dispatchable.
 *
 * @param actor
 * @param options
 */
export function action<A extends any[], R>(
  actor: Actor<A, R>,
  options: ActionOptions<A, R> = {},
): ActionFactory<A, R> {
  if (process.env.NODE_ENV === 'development' && !options.type) {
    options.type = resolveCallerName();
  }
  const factory = applyEnhancers([actor, options], enhanceAction.enhancers, (actor, options) => {
    return createAmosObject(
      'ACTION_FACTORY',
      Object.assign((...args: A): Action<A, R> => createAmosObject('ACTION', { args, factory }), {
        actor,
        options,
      }),
    );
  });
  return factory;
}
