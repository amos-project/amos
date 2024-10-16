/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, BoxFactoryStatic, createBoxFactory, Mutation, ShapedBox } from 'amos-core';
import { Map, MapKey, MapValue } from 'amos-shapes';
import { IDOf, Pair, PartialRecord, WellPartial } from 'amos-utils';

export interface MapBox<M extends Map<any, any> = any>
  extends ShapedBox<
    M,
    'set' | 'mergeItem' | 'updateItem' | 'delete' | 'clear' | 'searchUpdateOnce' | 'reset',
    'map' | 'get' | 'getOrDefault' | 'size' | 'keys' | 'has',
    Box<M>,
    Map<any, any>
  > {
  setAll(
    items: PartialRecord<MapKey<M>, MapValue<M>>,
  ): Mutation<[PartialRecord<MapKey<M>, MapValue<M>>], M>;
  setAll(
    items: readonly Pair<MapKey<M>, MapValue<M>>[],
  ): Mutation<[readonly Pair<MapKey<M>, MapValue<M>>[]], M>;
  merge(
    items: readonly Pair<MapKey<M>, WellPartial<MapValue<M>>>[],
  ): Mutation<[readonly Pair<MapKey<M>, WellPartial<MapValue<M>>>[]], M>;
  merge(
    items: PartialRecord<MapKey<M>, WellPartial<MapValue<M>>>,
  ): Mutation<[PartialRecord<MapKey<M>, WellPartial<MapValue<M>>>], M>;
}

export interface MapBoxFactory extends BoxFactoryStatic<MapBox> {
  new <M extends Map<any, any>>(key: string, initialState: M): MapBox<M>;
}

export const MapBox: MapBoxFactory = createBoxFactory<MapBox>({
  name: 'MapBox',
  mutations: {
    set: null,
    setAll: null,
    mergeItem: null,
    merge: null,
    reset: null,
    clear: null,
    delete: null,
    updateItem: null,
    searchUpdateOnce: null,
  },
  selectors: {
    map: null,
    get: null,
    getOrDefault: null,
    size: null,
    keys: null,
    has: null,
  },
});

export function createMapBox<K, V>(
  key: string,
  inferKey: K,
  defaultValue: V,
): MapBox<Map<IDOf<K>, V>> {
  return new MapBox(key, new Map<IDOf<K>, V>(defaultValue));
}
