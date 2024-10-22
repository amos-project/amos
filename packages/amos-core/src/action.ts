/*
 * @since 2020-11-03 13:23:14
 * @author acrazing <joking.young@gmail.com>
 */

import { AmosObject, createAmosObject, enhancerCollector, resolveCallerName } from 'amos-utils';
import { SelectorFactory } from './selector';
import { CacheOptions, Dispatch, Select } from './types';

export type Actor<A extends any[] = any, R = any> = (
  dispatch: Dispatch,
  select: Select,
  ...args: A
) => R;

export interface ActionOptions<A extends any[] = any, R = any> {
  type: string;
  actor: Actor<A, R>;

  /**
   * How to handle conflicted action dispatch.
   * - always: will always dispatch.
   * - leading: only take first to dispatch.
   * The default value is always when no conflictKey is set.
   *
   * TODO: do we need tail? If so, we should consider introduce DispatchContext to
   *  Actor to simplify the arguments.
   *  As for now, we discard that, but the API is hard to change.
   */
  conflictPolicy: 'always' | 'leading';

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
  readonly args: A;
}

export interface ActionFactory<A extends any[] = any, R = any>
  extends AmosObject<'action_factory'> {
  (...args: A): Action<A, R>;
}

export const enhanceAction = enhancerCollector<[ActionOptions], ActionFactory>();

export function action<A extends any[], R>(
  actor: Actor<A, R>,
  options: Partial<ActionOptions<A, R>> = {},
): ActionFactory<A, R> {
  const finalOptions = { ...options } as ActionOptions;
  finalOptions.type ??= resolveCallerName(2);
  finalOptions.actor = actor;
  finalOptions.conflictPolicy ??= options.conflictKey ? 'leading' : 'always';
  return enhanceAction.apply([finalOptions], (options) => {
    const factory = createAmosObject<ActionFactory>('action_factory', ((...args: any[]) => {
      return createAmosObject<Action>('action', {
        ...options,
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

export interface ActionFactory<A extends any[] = any, R = any> {
  select<S>(selector: SelectorFactory<A, S>): SelectableActionFactory<A, R, S>;
}

export interface SelectableActionFactory<A extends any[] = any, R = any, S = any>
  extends AmosObject<'action_factory'> {
  (...args: A): SelectableAction<A, R, S>;
}

enhanceAction((next) => (options) => {
  const factory = next(options);
  return Object.assign(factory, {
    select: (selector: SelectorFactory) => {
      Object.assign(options, { selector });
      return factory;
    },
  });
});
