/*
 * @since 2020-12-03 11:42:27
 * @author acrazing <joking.young@gmail.com>
 */

import {
  type ArraySource,
  Entry,
  ID,
  isArray,
  isIterable,
  type PartialDictionary,
} from 'amos-utils';
import { List, ListElement } from './List';
import { implementMapDelegations, Map, MapDelegateOperations } from './Map';

export interface ListMap<K extends ID, L extends List<any>>
  extends MapDelegateOperations<
    K,
    L,
    | 'concat'
    | 'copyWithin'
    | 'fill'
    | 'filter'
    | 'pop'
    | 'push'
    | 'reverse'
    | 'shift'
    | 'unshift'
    | 'slice'
    | 'sort'
    | 'splice'
    | 'delete'
    | 'set'
    | 'reset',
    'get' | 'has' | 'at' | 'map' | 'flat' | 'flatMap' | 'entries' | 'keys' | 'values',
    List<any>
  > {}

export class ListMap<K extends ID, L extends List<any>> extends Map<K, L> {
  constructor(defaultValue: L) {
    super(defaultValue);
  }

  override setItem(key: K, value: L | readonly ListElement<L>[]): this {
    return super.setItem(key, isArray(value) ? this.defaultValue.reset(value) : value);
  }

  override setAll(
    items:
      | PartialDictionary<K, L | readonly ListElement<L>[]>
      | ArraySource<Entry<K, L | readonly ListElement<L>[]>>,
  ): this {
    const data = Array.isArray(items)
      ? items
      : isIterable(items)
        ? Array.from(items)
        : Object.entries(items);
    data.forEach((d) => {
      if (Array.isArray(d[1])) {
        d[1] = this.defaultValue.reset(d[1]);
      }
    });
    return super.setAll(data);
  }
}

implementMapDelegations(ListMap, {
  concat: 'set',
  copyWithin: 'set',
  fill: 'set',
  filter: 'set',
  pop: 'set',
  push: 'set',
  reverse: 'set',
  shift: 'set',
  unshift: 'set',
  slice: 'set',
  sort: 'set',
  splice: 'set',
  delete: 'set',
  set: 'set',
  reset: 'set',
  get: 'get',
  has: 'get',
  at: 'get',
  map: 'get',
  flat: 'get',
  flatMap: 'get',
  entries: 'get',
  values: 'get',
  keys: 'get',
});
