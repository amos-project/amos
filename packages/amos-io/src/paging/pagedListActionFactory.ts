/*
 * @since 2022-01-11 15:07:57
 * @author junbao <junbao@moego.pet>
 */

import { action } from 'amos-core';
import { AnyFunc, NotImplemented } from 'amos-utils';

export interface PagedListActionFactoryOptions {}

export interface PagedListActionOptions<A extends any[], R> {}

export interface PagedListAction<S extends AnyFunc> {}

export interface PagedListActionFactory<S extends AnyFunc> {
  (options: PagedListActionOptions<any[], any>): PagedListAction<S>;
}

export function pagedListActionFactory(
  config: PagedListActionFactoryOptions,
): PagedListActionFactory<AnyFunc> {
  return action(
    () => {
      throw new NotImplemented();
    },
    {
      type: Math.random() + '',
    },
  );
}
