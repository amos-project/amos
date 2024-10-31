/*
 * @since 2024-10-18 23:47:02
 * @author junbao <junbao@moego.pet>
 */

import { action, Action, type Box, box, isAmosObject, SelectableAction, selector } from 'amos';
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
import { useDispatch } from './context';
import { useSelector } from './useSelector';

export interface QueryResultJSON<R> extends Pick<QueryResult<R>, 'status' | 'value'> {}

export class QueryResult<R> implements JSONSerializable<QueryResultJSON<R>> {
  /** @internal */
  id: string | undefined;
  /** @internal */
  _nextId: string | undefined;
  status: 'initial' | 'pending' | 'fulfilled' | 'rejected' = 'initial';
  promise: Defer<void> = defer();
  value: Awaited<R> | undefined = void 0;
  error: any = void 0;

  toJSON(): QueryResultJSON<R> {
    return {
      status: this.status,
      value: this.value,
    };
  }

  fromJS(state: JSONState<QueryResultJSON<R>>): this {
    const p = defer<void>();
    const r = clone(this, {
      ...state,
      promise: p,
    } as WellPartial<this>);
    r.isRejected() ? p.reject(new Error('Server error')) : r.isFulfilled() ? p.resolve() : void 0;
    return r;
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
      if (item.id === void 0) {
        if (item._nextId === void 0) {
          item._nextId = id;
        } else if (item._nextId !== id) {
          item = void 0;
        }
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

// Immutable state conflicts with react suspense use.
export const queryMapBox = box('amos.queries', () => new QueryResultMap());

export const selectQuery = selector((select, key: string, id: string) => {
  return select(queryMapBox).getItem(key, id);
});

export const updateQuery = action((dispatch, select, key: string, query: QueryResult<any>) => {
  const map = select(queryMapBox);
  if (map.get(key) === query) {
    map.set(key, clone(query, {}));
  }
  dispatch(queryMapBox.setState(map));
});

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
  const dispatch = useDispatch();
  const key = resolveCacheKey(select, action, action.conflictKey);
  const result = select(selectQuery(key, action.id));
  const shouldDispatch = result.status !== 'pending' && result.id !== void 0;
  if (shouldDispatch) {
    result.status = 'pending';
  }
  useEffect(() => {
    if (shouldDispatch) {
      (async () => {
        try {
          result.value = await dispatch(action);
          result.status = 'fulfilled';
          result.promise.resolve();
        } catch (e) {
          result.error = e;
          result.status = 'rejected';
          result.promise.reject(e);
        }
        dispatch(updateQuery(key, result));
      })();
    }
  }, [key, shouldDispatch]);
  if ('selector' in action) {
    return [
      select(
        isAmosObject<Box>(action.selector, 'box')
          ? action.selector
          : action.selector(...action.args),
      ),
      result,
    ];
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
