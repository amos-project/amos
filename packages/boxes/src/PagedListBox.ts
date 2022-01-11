/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { List, Map, Record, RecordMap, RecordObject } from 'amos-shapes';
import { ANY, ID, IDOf } from 'amos-utils';
import { createRecordBox, RecordBox } from './RecordBox';
import { createRecordMapBox, RecordMapBox } from './RecordMapBox';

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
  pagedData: new Map<number, any[]>(ANY),
  startingAfter: void 0,
  pageNum: 1,
  pageSize: 10,
  total: -1,
  ownerId: ANY,
}) {
  getAll(): List<E> {
    return this.data;
  }

  getPage(page: number = this.pageNum): readonly E[] {
    return this.pagedData.getItem(page);
  }
}

export function createPagedListBox<E, NT = E, OT = number>(
  key: string,
  inferElement: E,
  inferNextType?: NT,
  inferOwnerType?: OT,
): RecordBox<PagedList<IDOf<E>, IDOf<NT>, IDOf<OT>>> {
  return createRecordBox(key, new PagedList<IDOf<E>, IDOf<NT>, IDOf<OT>>());
}

export function createPagedListMapBox<E, NT = E, OT = number>(
  key: string,
  inferElement: E,
  inferNextType: NT,
  inferOwnerType: OT,
): RecordMapBox<RecordMap<PagedList<IDOf<E>, IDOf<NT>, IDOf<OT>>, 'ownerId'>> {
  return createRecordMapBox(key, new PagedList<IDOf<E>, IDOf<NT>, IDOf<OT>>(), 'ownerId');
}
