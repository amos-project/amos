/*
 * @since 2021-12-21 17:15:24
 * @author junbao <junbao@moego.pet>
 */

import { Record, RecordObject } from './Record';

export interface PagedListModel<T> {}

export interface PagedList<T> extends Record<PagedListModel<T>> {}
export class PagedList<T> extends RecordObject<PagedListModel<any>>({}) {}
