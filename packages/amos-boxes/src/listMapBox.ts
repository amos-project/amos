/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { ShapeBox } from 'amos-core';
import { List, ListMap } from 'amos-shapes';
import { IDOf } from 'amos-utils';
import { MapBox } from './mapBox';

export interface ListMapBox<LM extends ListMap<any, any>>
  extends ShapeBox<
    LM,
    | 'setItem'
    | 'setAll'
    | 'concatIn'
    | 'copyWithinIn'
    | 'fillIn'
    | 'filterThisIn'
    | 'mapThisIn'
    | 'popIn'
    | 'pushIn'
    | 'reverseIn'
    | 'shiftIn'
    | 'unshiftIn'
    | 'sliceIn'
    | 'sortIn'
    | 'spliceIn'
    | 'deleteIn'
    | 'setIn'
    | 'resetIn',
    never,
    MapBox<LM>,
    ListMap<any, any>
  > {}

export const ListMapBox = MapBox.extends<ListMapBox<any>>({
  name: 'ListMap',
  mutations: {
    concatIn: null,
    copyWithinIn: null,
    fillIn: null,
    filterThisIn: null,
    mapThisIn: null,
    popIn: null,
    pushIn: null,
    reverseIn: null,
    shiftIn: null,
    unshiftIn: null,
    sliceIn: null,
    sortIn: null,
    spliceIn: null,
    deleteIn: null,
    setIn: null,
    resetIn: null,
  },
  selectors: {},
});

export function listMapBox<K, E>(
  key: string,
  inferKey: K,
  defaultElement: E,
): ListMapBox<ListMap<IDOf<K>, List<E>>> {
  return new ListMapBox(key, new ListMap(new List(defaultElement)));
}
