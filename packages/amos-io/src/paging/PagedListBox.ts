/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { recordBox, type RecordBox } from 'amos-boxes/src/index';
import { PagedList } from './PagedList';

export function pagedListBox<TElement, TCursor, TOwner>(
  key: string,
  inferElement: TElement,
  inferCursorType?: TCursor,
  inferOwnerType?: TOwner,
): RecordBox<PagedList<TElement, TCursor, TOwner>> {
  return recordBox(key, new PagedList<TElement, TCursor, TOwner>());
}
