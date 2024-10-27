/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { RecordMapBox } from 'amos-boxes';
import { ShapeBox } from 'amos-core';
import type { IDOf } from 'amos-utils';
import { PagedList } from './PagedList';
import { PagedListMap } from './PagedListMap';

export interface PagedListMapBox<PM extends PagedListMap<any>>
  extends RecordMapBox<PM>,
    ShapeBox<PM, 'deleteIn', 'getAllIn' | 'getPageIn', PagedListMap<any>> {}

export const PagedListMapBox = RecordMapBox.extends<PagedListMapBox<any>>({
  name: 'PagedListMapBox',
  mutations: { deleteIn: null },
  selectors: {
    getAllIn: null,
    getPageIn: null,
  },
});

export function pagedListMapBox<TElement, TCursor, TOwner>(
  key: string,
  inferElement: TElement,
  inferCursorType?: TCursor,
  inferOwnerType?: TOwner,
): PagedListMapBox<PagedListMap<PagedList<TElement, TCursor, IDOf<TOwner>>>> {
  return new PagedListMapBox(
    key,
    new PagedListMap(new PagedList<TElement, TCursor, IDOf<TOwner>>(), 'ownerId'),
  );
}
