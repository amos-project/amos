/*
 * @since 2024-11-14 22:38:52
 * @author junbao <junbao@moego.pet>
 */

import { type ArraySource, Entry, ID, isIterable, type PartialDictionary } from 'amos-utils';
import {
  implementMapDelegations,
  Map,
  MapDelegateOperations,
  type MapEntry,
  type MapKey,
  type MapValue,
} from './Map';

export interface MapMap<K extends ID, M extends Map<any, any>>
  extends MapDelegateOperations<
    K,
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
    'hasItem' | 'getItem' | 'size' | 'entries' | 'keys' | 'values',
    Map<any, any>
  > {}

export class MapMap<K extends ID, M extends Map<any, any>> extends Map<K, M> {
  constructor(defaultValue: M) {
    super(defaultValue);
  }

  override setItem(
    key: K,
    value: M | PartialDictionary<MapKey<M>, MapValue<M>> | readonly MapEntry<M>[],
  ): this {
    return super.setItem(
      key,
      value instanceof Map
        ? value
        : this.defaultValue.reset(Array.isArray(value) ? Object.fromEntries(value) : value),
    );
  }

  override setAll(
    items:
      | PartialDictionary<K, M | PartialDictionary<MapKey<M>, MapValue<M>> | readonly MapEntry<M>[]>
      | ArraySource<
          Entry<K, M | PartialDictionary<MapKey<M>, MapValue<M>> | readonly MapEntry<M>[]>
        >,
  ): this {
    const data = Array.isArray(items)
      ? items
      : isIterable(items)
        ? Array.from(items)
        : Object.entries(items);
    data.forEach((d) => {
      if (Array.isArray(d[1])) {
        d[1] = this.defaultValue.reset(Object.fromEntries(d[1]));
      } else if (!(d[1] instanceof Map)) {
        d[1] = this.defaultValue.reset(d[1]);
      }
    });
    return super.setAll(data);
  }
}

implementMapDelegations(MapMap, {
  setItem: 'set',
  setAll: 'set',
  mergeItem: 'set',
  mergeAll: 'set',
  updateItem: 'set',
  updateAll: 'set',
  deleteItem: 'set',
  deleteAll: 'set',
  clear: 'set',
  reset: 'set',
  getItem: 'get',
  hasItem: 'get',
  size: 'get',
  entries: 'get',
  keys: 'get',
  values: 'get',
});
