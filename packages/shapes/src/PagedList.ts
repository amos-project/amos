/*
 * @since 2021-12-21 17:15:24
 * @author junbao <junbao@moego.pet>
 */

import { EntityInstance, EntityObject } from './Entity';

export interface PagedListModel<T> {}

export interface PagedList<T> extends EntityInstance<PagedListModel<T>> {}
export class PagedList<T> extends EntityObject<PagedListModel<any>>({}) {}
