/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, ShapeBox } from 'amos-core';
import { isSameList, List } from 'amos-shapes';

export interface ListBox<L extends List<any>>
  extends Box<L>,
    ShapeBox<
      L,
      | 'concat'
      | 'copyWithin'
      | 'fill'
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
    pop: null,
    push: null,
    reverse: null,
    shift: null,
    slice: null,
    sort: null,
    unshift: null,
  },
  selectors: {
    some: null, // cannot be cached because the param is a function
    get: null,
    flat: { cache: true },
    map: { equal: isSameList as any },
    every: null,
    filter: { equal: isSameList as any },
    find: null,
    findIndex: null,
    indexOf: { cache: true },
    includes: { cache: true },
    lastIndexOf: { cache: true },
    join: { cache: true },
    reduce: null,
    reduceRight: null,
    length: {
      derive: (state) => state.length,
    },
  },
});

export function listBox<E>(
  key: string,
  initialItems?: ArrayLike<E> | Iterable<E>,
): ListBox<List<E>> {
  return new ListBox(key, new List(initialItems));
}
