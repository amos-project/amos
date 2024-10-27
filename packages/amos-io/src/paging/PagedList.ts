/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { List, ListMap, type Record, RecordObject } from 'amos-shapes';
import { ANY, clone, type WellPartial } from 'amos-utils';

export interface PagedListModel<TElement, TCursor, TOwner> {
  data: List<TElement>;
  pagedData: ListMap<number, List<TElement>>;
  cursor: TCursor | undefined;
  page: number;
  perPage: number;
  total: number;
  /** @see PagedListMap */
  ownerId: TOwner;
}

export interface PagedList<TElement, TCursor, TOwner>
  extends Record<PagedListModel<TElement, TCursor, TOwner>> {}

export class PagedList<TElement, TCursor, TOwner> extends RecordObject<
  PagedListModel<any, any, any>
>({
  data: new List(),
  pagedData: new ListMap(new List()),
  cursor: void 0,
  page: 1,
  perPage: 10,
  total: -1,
  ownerId: ANY,
}) {
  getAll(): List<TElement> {
    return this.data;
  }

  getPage(page: number = this.page): List<TElement> {
    return this.pagedData.getItem(page);
  }

  delete(value: TElement): this {
    return clone(this, {
      data: this.data.delete(value),
      pagedData: this.pagedData.updateAll((v) => v.delete(value)),
    } as WellPartial<this>);
  }
}
