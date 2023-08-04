/*
 * @since 2022-01-11 15:07:57
 * @author junbao <junbao@moego.pet>
 */

import { AnyFn } from 'amos-utils';

export interface PagedListActionFactoryOptions {}

export interface PagedListActionOptions<A extends any[], R> {}

export interface PagedListAction<S extends AnyFn> {}

export interface PagedListActionFactory<S extends AnyFn> {
  (options: PagedListActionOptions<any[], any>): PagedListAction<S>;
}

export function createPagedListActionFactory(
  config: PagedListActionFactoryOptions,
): PagedListActionFactory<AnyFn> {
  return null as any;
}
