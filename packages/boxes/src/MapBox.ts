/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { BoxWithStateMethods, createBoxFactory } from 'amos-core';
import { Map } from 'amos-shapes';
import { IDOf } from 'amos-utils';

export type MapBox<M extends Map<any, any>> = BoxWithStateMethods<
  M,
  'setItem' | 'setAll' | 'mergeItem' | 'mergeAll' | 'updateItem' | 'removeItem' | 'clear' | 'reset',
  'map' | 'getItem' | 'size' | 'keys' | 'hasItem'
>;

export const MapBox = createBoxFactory<MapBox<any>>({
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
