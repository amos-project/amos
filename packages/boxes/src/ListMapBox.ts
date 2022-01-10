/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { List, ListMap } from 'amos-shapes';
import { IDOf } from 'amos-utils';
import { MapBox } from './MapBox';

export class ListMapBox<S extends ListMap<any, any>> extends MapBox<S> {}

export function createListMapBox<K, E>(
  key: string,
  inferKey: K,
  defaultElement: E,
): ListMapBox<ListMap<IDOf<K>, List<E>>> {
  return new ListMapBox(key, new ListMap(new List(defaultElement)));
}
