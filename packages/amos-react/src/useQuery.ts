/*
 * @since 2024-10-18 23:47:02
 * @author junbao <junbao@moego.pet>
 */

import { Action, box, SelectableAction } from 'amos';
import { resolveCacheKey } from 'amos-core';
import {
  clone,
  defer,
  Defer,
  type JSONSerializable,
  type JSONState,
  type WellPartial,
} from 'amos-utils';
import { useEffect } from 'react';
import { useSelector } from './useSelector';

export interface QueryResultJSON<R> extends Pick<QueryResult<R>, 'status' | 'value' | 'error'> {}

export class QueryResult<R> implements JSONSerializable<QueryResultJSON<R>> {
  /** @internal */
  id: string | undefined;
  status: 'pending' | 'fulfilled' | 'rejected' = 'pending';
  promise: Defer<void> = defer();
  value: Awaited<R> | undefined;
  error: any;

  toJSON(): QueryResultJSON<R> {
    return {
      status: this.status,
      value: this.value,
      error: this.error,
    };
  }

  fromJS(state: JSONState<QueryResultJSON<R>>): this {
    return clone(this, {
      ...state,
      promise:
        state.status === 'pending'
          ? defer()
          : state.status === 'rejected'
            ? Promise.reject(state.error)
            : Promise.resolve(state.value),
    } as WellPartial<this>);
  }

  isPending() {
    return this.status === 'pending';
  }

  isFulfilled() {
    return this.status === 'pending';
  }

  isRejected() {
    return this.status === 'rejected';
  }
}

export class QueryResultMap
  extends Map<string, QueryResult<any>>
  implements JSONSerializable<Record<string, QueryResult<any>>>
{
  fromJS(state: JSONState<Record<string, QueryResult<any>>>): this {
    const dft = new QueryResult<any>();
    for (const k in state) {
      if (Object.hasOwn(state, k)) {
        this.set(k, dft.fromJS(state[k]));
      }
    }
    return this;
  }

  toJSON(): Record<string, QueryResult<any>> {
    return Object.fromEntries(this.entries());
  }

  getItem(key: string, id: string): QueryResult<any> {
    let item = this.get(key);
    if (item) {
      if (!item.id) {
        item.id = id;
      } else if (item.id !== id) {
        item = void 0;
      }
    }
    if (!item) {
      item = new QueryResult<any>();
      item.id = id;
      this.set(key, item);
    }
    return item;
  }
}

export const queryMapBox = box('amos.queries', () => new QueryResultMap());

export interface UseQuery {
  <A extends any[] = any, R = any, S = any>(
    action: SelectableAction<A, R, S>,
  ): [value: S, result: QueryResult<R>];
  <A extends any[] = any, R = any>(
    action: Action<A, R>,
  ): [value: Awaited<R> | undefined, result: QueryResult<R>];
}

/**
 * `useQuery` auto dispatch the action, and auto re-dispatch when the params changes,
 * It returns a tuple whose first element is the return value of the action when the
 * action's return value is fulfilled, and if the action has a bound selector, will
 * always be the selector's value; the second element will be a {@link QueryResult} to
 * let you get the dispatch status.
 */
export const useQuery: UseQuery = (action: Action | SelectableAction): [any, QueryResult<any>] => {
  const select = useSelector();
  const key = resolveCacheKey(select, action, action.conflictKey);
  const result = select(queryMapBox).getItem(key, action.id);
  useEffect(() => {}, [key]);
  if ('selector' in action) {
    return [select(action.selector(...action.args)), result];
  } else {
    return [result.value, result];
  }
};

export interface UseSuspenseQuery {
  <A extends any[] = any, R = any, S = any>(action: SelectableAction<A, R, S>): S;
  <A extends any[] = any, R = any>(action: Action<A, R>): Awaited<R>;
}

/**
 * `useSuspenseQuery` almost same to {@link useQuery}, except for it will throw the
 * returned value if it is a promise to work with react Suspense component.
 */
export const useSuspenseQuery: UseSuspenseQuery = (action: Action): any => {
  const [value, result] = useQuery(action);
  if (result.isPending()) {
    throw result.promise;
  } else if (result.isRejected()) {
    throw result.error;
  }
  return value;
};
