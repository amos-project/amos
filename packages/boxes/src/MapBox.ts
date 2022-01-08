/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, Mutation, Selector } from 'amos-core';
import { Map, MapKey, MapPair, MapValue } from 'amos-shapes';
import { IDOf, Pair } from 'amos-utils';

export class MapBox<S extends Map<any, any>> extends Box<S> {
  size: () => Selector<[], number> = this.selector('size');
  has: (key: MapKey<S>) => Selector<[MapKey<S>], boolean> = this.selector('hasItem');
  get: (key: MapKey<S>) => Selector<[MapKey<S>], MapValue<S>> = this.selector('getItem');
  keys: () => Selector<[], ReturnType<S['keys']>> = this.selector('keys');
  map: <U>(
    callbackFn: (value: MapValue<S>, key: MapKey<S>, index: number) => U,
  ) => Selector<[(value: MapValue<S>, key: MapKey<S>, index: number) => U], U[]> =
    this.selector('map');

  set: (key: MapKey<S>, value: MapValue<S>) => Mutation<[MapKey<S>, MapValue<S>], S> =
    this.mutation('setItem');
  merge: (
    key: MapKey<S>,
    props: Partial<MapValue<S>>,
  ) => Mutation<[MapKey<S>, Partial<MapValue<S>>], S> = this.mutation('mergeItem');
  setAll: (items: readonly MapPair<S>[]) => Mutation<[readonly MapPair<S>[]], S> =
    this.mutation('setAll');
  mergeAll: (
    items: readonly Pair<MapKey<S>, Partial<MapValue<S>>>[],
  ) => Mutation<[readonly Pair<MapKey<S>, Partial<MapValue<S>>>[]], S> = this.mutation('mergeAll');
  removeItem: (key: MapKey<S>) => Mutation<[MapKey<S>], S> = this.mutation('removeItem');
}

export function createMapBox<K, V>(
  key: string,
  inferKey: K,
  defaultValue: V,
): MapBox<Map<IDOf<K>, V>> {
  return new MapBox(key, new Map(inferKey as IDOf<K>, defaultValue));
}
