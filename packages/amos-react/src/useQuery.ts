/*
 * @since 2024-10-18 23:47:02
 * @author junbao <junbao@moego.pet>
 */

import { Action, SelectableAction } from 'amos';
import { NotImplemented } from 'amos-utils';

export interface QueryState<R> {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  result: R;
  value: Awaited<R> | undefined;
  error: any;
}

export interface UseQuery {
  <A extends any[] = any, R = any, S = any>(
    action: SelectableAction<A, R, S>,
  ): [value: S, state: QueryState<R>];
  <A extends any[] = any, R = any>(
    action: Action<A, R>,
  ): [value: Awaited<R> | undefined, state: QueryState<R>];
}

/**
 * `useQuery` auto dispatch the action, and auto re-dispatch when the params changes,
 * It returns a tuple whose first element is the return value of the action when the
 * action's return value is fulfilled, and if the action has a bound selector, will
 * always be the selector's value; the second element will be a {@link QueryState} to
 * let you get the dispatch status.
 */
export const useQuery: UseQuery = (action: Action): [any, QueryState<any>] => {
  throw new NotImplemented();
};

/**
 * `useSuspenseQuery` almost same to {@link useQuery}, except for it will throw the
 * returned value if it is a promise to work with react Suspense component.
 */
export const useSuspenseQuery: UseQuery = (action: Action): [any, QueryState<any>] => {
  throw new NotImplemented();
};
