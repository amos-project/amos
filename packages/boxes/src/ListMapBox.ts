/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { BoxWithStateMethods } from 'amos-core';
import { List, ListMap } from 'amos-shapes';
import { IDOf } from 'amos-utils';
import { MapBox } from './MapBox';

export type ListMapBox<LM extends ListMap<any, any>> = BoxWithStateMethods<
  LM,
  never,
  never,
  MapBox<LM>
>;

export const ListMapBox = MapBox.extends({
  name: 'ListMap',
  mutations: {},
  selectors: {},
});

export function createListMapBox<K, E>(
  key: string,
  inferKey: K,
  defaultElement: E,
): ListMapBox<ListMap<IDOf<K>, List<E>>> {
  return new ListMapBox(key, new ListMap(new List(defaultElement)));
}
