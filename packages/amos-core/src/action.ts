/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { AmosObject, createAmosObject, enhancerCollector } from 'amos-utils';
import { SelectorFactory } from './selector';
import { CacheOptions, Dispatch, Select } from './types';

export type Actor<A extends any[] = any, R = any> = (
  dispatch: Dispatch,
  select: Select,
  ...args: A
) => R;

export interface ActionOptions<A extends any[] = any, R = any> {
  type: string;

  /**
   * How to handle conflicted action dispatch.
   * - always: will always dispatch.
   * - leading: only take first to dispatch.
   * The default value is always when no conflictKey is set.
   */
  conflictPolicy: 'always' | 'leading' | 'trailing';

  /**
   * Use for checking if the action is equal to another one, if so,
   * dispatch will respect {@link conflictPolicy} strategy.
   *
   * If set this option, conflictPolicy's default value is 'first'.
   * This option is required for {@link import('amos-react').useQuery}.
   */
  conflictKey?: CacheOptions<A>;
}

export interface Action<A extends any[] = any, R = any>
  extends AmosObject<'action'>,
    Readonly<ActionOptions<A, R>> {
  readonly actor: (dispatch: Dispatch, select: Select) => R;
  readonly args: readonly unknown[];
}

export interface ActionFactoryStatic<A extends any[] = any, R = any>
  extends AmosObject<'action_factory'> {}

export interface ActionFactory<A extends any[] = any, R = any> extends ActionFactoryStatic<A, R> {
  (...args: A): Action<A, R>;
}

export const enhanceAction = enhancerCollector<[Actor, ActionOptions], ActionFactory>();

export function action<A extends any[], R>(
  actor: Actor<A, R>,
  options: Partial<ActionOptions<A, R>> = {},
): ActionFactory<A, R> {
  const finalOptions = { type: '', ...options } as ActionOptions;
  finalOptions.conflictPolicy ??= options.conflictKey ? 'leading' : 'always';
  return enhanceAction.apply([actor, finalOptions], (actor, options) => {
    const factory = createAmosObject<ActionFactory>('action_factory', ((...args: any[]) => {
      return createAmosObject<Action>('action', {
        ...options,
        actor: (dispatch, select) => actor(dispatch, select, ...args),
        id: factory.id,
        args: args,
      });
    }) as ActionFactory);
    return factory;
  });
}

export interface SelectableActionOptions<A extends any[] = any, S = any> {
  /**
   * Use for {@link import('amos-react').useQuery} derive the state even if
   * the action is running.
   */
  selector: SelectorFactory<A, S>;
}

export interface SelectableAction<A extends any[] = any, R = any, S = any>
  extends Action<A, R>,
    SelectableActionOptions<A, S> {}

export interface ActionFactoryStatic<A extends any[] = any, R = any> {
  select<S>(selector: SelectorFactory<A, S>): SelectableActionFactory<A, R, S>;
}

export interface SelectableActionFactory<A extends any[] = any, R = any, S = any>
  extends AmosObject<'action_factory'> {
  (...args: A): SelectableAction<A, R, S>;
}

enhanceAction((next) => (actor, options) => {
  const factory = next(actor, options);
  return Object.assign(factory, {
    select: (selector: SelectorFactory) => {
      Object.assign(options, { selector });
      return factory;
    },
  });
});
