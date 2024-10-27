/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { ShapeBox } from 'amos-core';
import { List, ListMap } from 'amos-shapes';
import { IDOf } from 'amos-utils';
import { MapBox } from './mapBox';

export interface ListMapBox<LM extends ListMap<any, any>>
  extends MapBox<LM>,
    ShapeBox<
      LM,
      | 'setItem'
      | 'setAll'
      | 'concatIn'
      | 'copyWithinIn'
      | 'fillIn'
      | 'filterIn'
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
      'getIn' | 'hasIn' | 'atIn' | 'mapIn' | 'flatIn' | 'flatMapIn',
      ListMap<any, any>
    > {}

export const ListMapBox = MapBox.extends<ListMapBox<any>>({
  name: 'ListMap',
  mutations: {
    concatIn: null,
    copyWithinIn: null,
    fillIn: null,
    filterIn: null,
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
  selectors: {
    getIn: null,
    hasIn: null,
    atIn: null,
    mapIn: null,
    flatIn: { cache: true },
    flatMapIn: null,
  },
});

export function listMapBox<K, E>(
  key: string,
  inferKey: K,
  defaultElement: E,
): ListMapBox<ListMap<IDOf<K>, List<E>>> {
  return new ListMapBox(key, new ListMap(new List()));
}
