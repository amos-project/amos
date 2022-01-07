/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { BoxOptions } from 'amos-core';
import { List, ListMap } from 'amos-shapes';
import { MapBox } from './MapBox';

export class ListMapBox<K, V, T extends ListMap<K, V>> extends MapBox<K, V, T> {}

export function createListMapBox<K, V>(
  key: string,
  inferKey: K,
  inferValue: V,
  options?: BoxOptions<ListMap<K, V, List<V>>>,
): ListMapBox<K, V, ListMap<K, V>> {
  return new ListMapBox(key, new ListMap(inferKey, inferValue), options);
}
