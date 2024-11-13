/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, ShapeBox } from 'amos-core';
import { Map } from 'amos-shapes';
import { ID, IDOf, once } from 'amos-utils';

export interface MapBox<M extends Map<any, any> = Map<any, any>>
  extends Box<M>,
    ShapeBox<
      M,
      | 'setItem'
      | 'setAll'
      | 'mergeItem'
      | 'mergeAll'
      | 'updateItem'
      | 'updateAll'
      | 'deleteItem'
      | 'deleteAll'
      | 'clear'
      | 'reset',
      'getItem' | 'hasItem' | 'size',
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
    deleteItem: null,
    deleteAll: null,
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
      hasRow: (state: Map<any, any>, key) => state.hasItem(key),
      getRow: (state: Map<any, any>, key) => state.getItem(key),
      hydrate: (state: Map<any, any>, rows) => state.setAll(state.fromJS(rows).toJSON()),
    },
  },
});

export function mapBox<K, V>(key: string, inferKey: K, defaultValue: V): MapBox<Map<IDOf<K>, V>> {
  return new MapBox(
    key,
    once(() => new Map<IDOf<K>, V>(defaultValue)),
  );
}
