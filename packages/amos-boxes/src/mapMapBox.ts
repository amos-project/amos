/*
 * @since 2024-11-14 23:00:43
 * @author junbao <junbao@moego.pet>
 */

import { ShapeBox } from 'amos-core';
import { Map, MapMap } from 'amos-shapes';
import { type ID, IDOf, once } from 'amos-utils';
import { MapBox } from './mapBox';

export interface MapMapBox<LM extends MapMap<any, any>>
  extends MapBox<LM>,
    ShapeBox<
      LM,
      | 'setItem'
      | 'setAll'
      | 'setItemIn'
      | 'setAllIn'
      | 'mergeItemIn'
      | 'mergeAllIn'
      | 'updateItemIn'
      | 'updateAllIn'
      | 'deleteItemIn'
      | 'deleteAllIn'
      | 'clearIn'
      | 'resetIn',
      'hasItemIn' | 'getItemIn' | 'sizeIn',
      MapMap<any, any>
    > {}

export const MapMapBox = MapBox.extends<MapMapBox<any>>({
  name: 'MapMap',
  mutations: {
    setItemIn: null,
    setAllIn: null,
    mergeItemIn: null,
    mergeAllIn: null,
    updateItemIn: null,
    updateAllIn: null,
    deleteItemIn: null,
    deleteAllIn: null,
    clearIn: null,
    resetIn: null,
  },
  selectors: {
    getItemIn: null,
    hasItemIn: null,
    sizeIn: null,
  },
});

export function mapMapBox<KO, KI, V>(
  key: string,
  outerKey: KO & ID,
  innerKey: KI & ID,
  defaultValue: V,
): MapMapBox<MapMap<IDOf<KO>, Map<IDOf<KI>, V>>> {
  return new MapMapBox(
    key,
    once(() => new MapMap(new Map(defaultValue))),
  );
}
