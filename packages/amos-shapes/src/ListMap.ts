/*
 * @since 2020-12-03 11:42:27
 * @author acrazing <joking.young@gmail.com>
 */

import { ID, isArray, Pair, PartialRecord } from 'amos-utils';
import { List, ListElement } from './List';
import { DelegateMapValueMutations, implementMapDelegations, Map } from './Map';

export interface ListMap<K extends ID, L extends List<any>>
  extends DelegateMapValueMutations<
    K,
    L,
    | 'concat'
    | 'copyWithin'
    | 'fill'
    | 'filterThis'
    | 'mapThis'
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
    | 'reset'
    | 'get',
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
      | PartialRecord<K, L | readonly ListElement<L>[]>
      | ReadonlyArray<Pair<K, L | readonly ListElement<L>[]>>,
  ): this {
    const data = Array.isArray(items) ? items : Object.entries(items);
    data.forEach((d) => {
      if (Array.isArray(d[1])) {
        d[1] = this.defaultValue.reset(d[1]);
      }
    });
    return super.setAll(data);
  }
}

implementMapDelegations(ListMap, {
  concat: null,
  copyWithin: null,
  fill: null,
  filterThis: null,
  mapThis: null,
  pop: null,
  push: null,
  reverse: null,
  shift: null,
  unshift: null,
  slice: null,
  sort: null,
  splice: null,
  delete: null,
  set: null,
  reset: null,
  get: null,
});
