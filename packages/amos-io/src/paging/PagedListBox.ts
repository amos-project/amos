/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { recordBox, RecordBox, RecordMapBox } from 'amos-boxes';
import { ShapeBox } from 'amos-core';
import {
  DelegateMapValueMutations,
  implementMapDelegations,
  List,
  ListMap,
  Record,
  RecordMap,
  RecordObject,
} from 'amos-shapes';
import { ANY, clone, ID, IDOf, WellPartial } from 'amos-utils';

export interface PagedListModel<E extends ID, NT extends ID = E, OT extends ID = number> {
  data: List<E>;
  pagedData: ListMap<number, List<E>>;
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
  pagedData: new ListMap<number, List<any>>(ANY),
  startingAfter: void 0,
  pageNum: 1,
  pageSize: 10,
  total: -1,
  ownerId: ANY,
}) {
  getAll(): List<E> {
    return this.data;
  }

  getPage(page: number = this.pageNum): List<E> {
    return this.pagedData.getItem(page);
  }

  delete(value: E): this {
    return clone(this, {
      data: this.data.delete(value),
      pagedData: this.pagedData.updateAll((v) => v.delete(value)),
    } as WellPartial<this>);
  }
}

export function createPagedListBox<E, NT = E, OT = number>(
  key: string,
  inferElement: E,
  inferNextType?: NT,
  inferOwnerType?: OT,
): RecordBox<PagedList<IDOf<E>, IDOf<NT>, IDOf<OT>>> {
  return recordBox(key, new PagedList<IDOf<E>, IDOf<NT>, IDOf<OT>>());
}

export interface PagedListMap<V extends PagedList<any, any, any>>
  extends DelegateMapValueMutations<V['ownerId'], V, 'delete', PagedList<any>> {}

export class PagedListMap<V extends PagedList<any, any, any>> extends RecordMap<V, 'ownerId'> {}

implementMapDelegations(PagedListMap, { delete: null });

export interface PagedListMapBox<PM extends PagedListMap<any>>
  extends RecordMapBox<PM>,
    ShapeBox<PM, 'deleteIn', never, PagedListMap<any>> {}

export const PagedListMapBox = RecordMapBox.extends<PagedListMapBox<any>>({
  name: 'PagedListMapBox',
  mutations: { deleteIn: null },
  selectors: {},
});

export function createPagedListMapBox<E, NT = E, OT = number>(
  key: string,
  inferElement: E,
  inferNextType: NT,
  inferOwnerType: OT,
): PagedListMapBox<PagedListMap<PagedList<IDOf<E>, IDOf<NT>, IDOf<OT>>>> {
  return new PagedListMapBox(key, new PagedListMap(new PagedList(), 'ownerId'));
}
