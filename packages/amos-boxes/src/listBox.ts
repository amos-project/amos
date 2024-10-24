/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, ShapeBox } from 'amos-core';
import { List } from 'amos-shapes';

export interface ListBox<L extends List<any>>
  extends Box<L>,
    ShapeBox<
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
      | 'reset',
      | 'some'
      | 'reduce'
      | 'reduceRight'
      | 'findIndex'
      | 'flat'
      | 'includes'
      | 'indexOf'
      | 'join'
      | 'lastIndexOf'
      | 'map'
      | 'find'
      | 'filter'
      | 'get'
      | 'length'
      | 'every',
      List<any>
    > {}

export const ListBox = Box.extends<ListBox<any>>({
  name: 'ListBox',
  mutations: {
    concat: null,
    set: null,
    copyWithin: null,
    reset: null,
    splice: null,
    delete: null,
    fill: null,
    filterThis: null,
    mapThis: null,
    pop: null,
    push: null,
    reverse: null,
    shift: null,
    slice: null,
    sort: null,
    unshift: null,
  },
  selectors: {
    some: null,
    get: null,
    flat: null,
    map: null,
    every: null,
    filter: null,
    find: null,
    findIndex: null,
    indexOf: null,
    includes: null,
    lastIndexOf: null,
    join: null,
    reduce: null,
    reduceRight: null,
    length: null,
  },
});

export function listBox<E>(key: string, defaultElement: E): ListBox<List<E>> {
  return new ListBox(key, new List(defaultElement));
}
