/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, BoxFactoryStatic, createBoxFactory, ShapedBox } from 'amos-core';
import { Map } from 'amos-shapes';
import { IDOf } from 'amos-utils';

export interface MapBox<M extends Map<any, any> = any>
  extends ShapedBox<
    M,
    | 'setItem'
    | 'setAll'
    | 'mergeItem'
    | 'mergeAll'
    | 'updateItem'
    | 'removeItem'
    | 'clear'
    | 'searchUpdateOnce'
    | 'reset',
    'map' | 'getItem' | 'size' | 'keys' | 'hasItem',
    Box<M>,
    Map<any, any>
  > {}

export interface MapBoxFactory extends BoxFactoryStatic<MapBox> {
  new <M extends Map<any, any>>(key: string, initialState: M): MapBox<M>;
}

export const MapBox: MapBoxFactory = createBoxFactory<MapBox>({
  name: 'MapBox',
  mutations: {
    setItem: null,
    setAll: null,
    mergeAll: null,
    mergeItem: null,
    reset: null,
    clear: null,
    removeItem: null,
    updateItem: null,
  },
  selectors: { map: null, getItem: null, size: null, keys: null, hasItem: null },
});

export function createMapBox<K, V>(
  key: string,
  inferKey: K,
  defaultValue: V,
): MapBox<Map<IDOf<K>, V>> {
  return new MapBox(key, new Map<IDOf<K>, V>(defaultValue));
}
