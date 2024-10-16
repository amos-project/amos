/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { BoxFactory, Mutation, ShapedBox } from 'amos-core';
import { List, ListElement, ListMap, MapKey, MapValue } from 'amos-shapes';
import { IDOf, OmitKeys, Pair, PartialRecord } from 'amos-utils';
import { MapBox } from './MapBox';

export interface ListMapBox<LM extends ListMap<any, any>>
  extends ShapedBox<
    LM,
    | 'concatAt'
    | 'copyWithinAt'
    | 'fillAt'
    | 'filterThisAt'
    | 'mapThisAt'
    | 'popAt'
    | 'pushAt'
    | 'reverseAt'
    | 'shiftAt'
    | 'unshiftAt'
    | 'sliceAt'
    | 'sortAt'
    | 'spliceAt'
    | 'deleteAt'
    | 'setAt'
    | 'resetAt',
    never,
    OmitKeys<MapBox<LM>, 'set' | 'setAll'>,
    ListMap<any, any>
  > {
  /** {@link ListMap#set} */
  set(key: MapKey<LM>, value: MapValue<LM>): Mutation<[key: MapKey<LM>, value: MapValue<LM>], LM>;
  set(
    key: MapKey<LM>,
    items: readonly ListElement<MapValue<LM>>[],
  ): Mutation<[key: MapKey<LM>, items: readonly ListElement<MapValue<LM>>[]], LM>;

  /** {@link ListMap#setAll} */
  setAll(
    items: PartialRecord<MapKey<LM>, NoInfer<MapValue<LM> | readonly ListElement<MapValue<LM>>[]>>,
  ): Mutation<
    [items: PartialRecord<MapKey<LM>, MapValue<LM> | readonly ListElement<MapValue<LM>>[]>],
    LM
  >;
  setAll(
    items: readonly Pair<MapKey<LM>, MapValue<LM> | readonly ListElement<MapValue<LM>>[]>[],
  ): Mutation<
    [items: readonly Pair<MapKey<LM>, MapValue<LM> | readonly ListElement<MapValue<LM>>[]>[]],
    LM
  >;
}

export interface ListMapBoxFactory extends BoxFactory<ListMapBox<any>> {
  new <LM extends ListMap<any, any>>(key: string, initialState: LM): ListMapBox<LM>;
}

export const ListMapBox: ListMapBoxFactory = MapBox.extends<ListMapBox<any>>({
  name: 'ListMap',
  mutations: {
    concatAt: null,
    copyWithinAt: null,
    fillAt: null,
    filterThisAt: null,
    mapThisAt: null,
    popAt: null,
    pushAt: null,
    reverseAt: null,
    shiftAt: null,
    unshiftAt: null,
    sliceAt: null,
    sortAt: null,
    spliceAt: null,
    deleteAt: null,
    setAt: null,
    resetAt: null,
  },
  selectors: {},
});

export function createListMapBox<K, E>(
  key: string,
  inferKey: K,
  defaultElement: E,
): ListMapBox<ListMap<IDOf<K>, List<E>>> {
  return new ListMapBox(key, new ListMap(new List(defaultElement)));
}
