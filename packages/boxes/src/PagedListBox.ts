/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { BoxOptions } from 'amos-core';
import { List, Map, Record, RecordObject } from 'amos-shapes';
import { ANY, ID } from 'amos-utils';
import { createRecordBox } from './RecordBox';
import { createRecordMapBox } from './RecordMapBox';

export interface PagedListModel<E extends ID, NT extends ID = E, OT extends ID = number> {
  data: List<E>;
  pagedData: Map<number, readonly E[]>;
  startingAfter: NT | undefined;
  pageNum: number;
  pageSize: number;
  total: number;
  ownerId: OT;
}

export interface PagedList<E extends ID, NT extends ID = E, OT extends ID = number>
  extends Record<PagedListModel<E, NT, OT>> {}

export class PagedList<
  E extends ID,
  NT extends ID = E,
  OT extends ID = number,
> extends RecordObject<PagedListModel<any>>({
  data: new List(ANY),
  pagedData: new Map<number, any[]>(0, []),
  startingAfter: void 0,
  pageNum: 1,
  pageSize: 10,
  total: -1,
  ownerId: ANY,
}) {
  getData() {
    return this.data;
  }

  getPage(page: number = this.pageNum) {
    return this.pagedData.getItem(page);
  }
}

export function createPagedListBox<E extends ID, NT extends ID = E>(
  key: string,
  inferElem: E,
  inferNextType: NT,
  options?: BoxOptions<PagedList<E, NT>>,
) {
  return createRecordBox(key, new PagedList<E, NT>(), options);
}

export function createPagedListMapBox<E extends ID, NT extends ID = E, OT extends ID = number>(
  key: string,
  inferElem: E,
  inferNextType: NT,
  inferOwnerType: OT,
) {
  return createRecordMapBox(key, new PagedList<E, NT, OT>(), 'ownerId');
}
