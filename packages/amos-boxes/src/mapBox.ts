/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, ShapeBox } from 'amos-core';
import { Map } from 'amos-shapes';
import { ID, IDOf } from 'amos-utils';

export interface MapBox<M extends Map<any, any> = Map<any, any>>
  extends ShapeBox<
    M,
    | 'setItem'
    | 'setAll'
    | 'mergeItem'
    | 'mergeAll'
    | 'updateItem'
    | 'updateAll'
    | 'removeItem'
    | 'removeAll'
    | 'clear'
    | 'reset',
    'getItem' | 'hasItem' | 'size',
    Box<M>,
    Map<any, any>
  > {}

export const MapBox = Box.extends<MapBox>({
  name: 'MapBox',
  mutations: {
    setItem: null,
    setAll: null,
    mergeItem: null,
    mergeAll: null,
    updateItem: null,
    updateAll: null,
    removeItem: null,
    removeAll: null,
    clear: null,
    reset: null,
  },
  selectors: {
    getItem: (b) => ({
      loadRow: (key: ID) => [b, key],
    }),
    hasItem: null,
    size: null,
  },
  options: {
    table: {
      toRows: (state: Map<any, any>) => state.toJSON(),
    },
  },
});

export function mapBox<K, V>(key: string, inferKey: K, defaultValue: V): MapBox<Map<IDOf<K>, V>> {
  return new MapBox(key, new Map<IDOf<K>, V>(defaultValue));
}
