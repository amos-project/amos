/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { BoxFactory, Mutation, ShapedBox } from 'amos-core';
import { List, ListElement, ListMap, MapKey, MapPair, MapValue } from 'amos-shapes';
import { IDOf, Pair } from 'amos-utils';
import { MapBox } from './MapBox';

export interface ListMapBox<LM extends ListMap<any, any>>
  extends ShapedBox<LM, never, never, Omit<MapBox<LM>, 'setItem' | 'setAll'>> {
  setItem(
    key: MapKey<LM>,
    value: MapValue<LM>,
  ): Mutation<[key: MapKey<LM>, value: MapValue<LM>], LM>;
  setItem(
    key: MapKey<LM>,
    items: readonly ListElement<MapValue<LM>>[],
  ): Mutation<[key: MapKey<LM>, items: readonly ListElement<MapValue<LM>>[]], LM>;

  setAll(items: readonly MapPair<LM>[]): Mutation<[items: readonly MapPair<LM>[]], LM>;
  setAll(
    items: readonly Pair<MapKey<LM>, readonly ListElement<MapValue<LM>>[]>[],
  ): Mutation<[items: readonly Pair<MapKey<LM>, readonly ListElement<MapValue<LM>>[]>[]], LM>;
}

export interface ListMapBoxFactory extends BoxFactory<ListMapBox<any>> {
  new <LM extends ListMap<any, any>>(key: string, initialState: LM): ListMapBox<LM>;
}

export const ListMapBox: ListMapBoxFactory = MapBox.extends<ListMapBox<any>>({
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
