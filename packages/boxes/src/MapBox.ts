/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, BoxOptions, Mutation, Selector } from 'amos-core';
import { Map, MapKey, MapPair, MapValue } from 'amos-shapes';
import { Pair } from 'amos-utils';

export class MapBox<K, V, T extends Map<K, V>> extends Box<T> {
  size: () => Selector<[], number> = this.selector('size');
  has: (key: MapKey<T>) => Selector<[MapKey<T>], boolean> = this.selector('has');
  get: (key: MapKey<T>) => Selector<[MapKey<T>], MapValue<T>> = this.selector('get');
  keys: () => Selector<[], ReturnType<T['keys']>> = this.selector('keys');
  values: () => Selector<[], ReturnType<T['values']>> = this.selector('values');
  entities: () => Selector<[], ReturnType<T['entities']>> = this.selector('entities');
  map: <U>(
    callbackFn: (value: MapValue<T>, key: MapKey<T>, index: number) => U,
  ) => Selector<[(value: MapValue<T>, key: MapKey<T>, index: number) => U], U[]> =
    this.selector('map');

  set: (key: MapKey<T>, value: MapValue<T>) => Mutation<[MapKey<T>, MapValue<T>], T> =
    this.mutation('set');
  merge: (
    key: MapKey<T>,
    props: Partial<MapValue<T>>,
  ) => Mutation<[MapKey<T>, Partial<MapValue<T>>], T> = this.mutation('merge');
  setAll: (items: readonly MapPair<T>[]) => Mutation<[readonly MapPair<T>[]], T> =
    this.mutation('setAll');
  mergeAll: (
    items: readonly Pair<MapKey<T>, Partial<MapValue<T>>>[],
  ) => Mutation<[readonly Pair<MapKey<T>, Partial<MapValue<T>>>[]], T> = this.mutation('mergeAll');
  delete: (key: MapKey<T>) => Mutation<[MapKey<T>], T> = this.mutation('delete');
}

export function createMapBox<K, V>(
  key: string,
  defaultValue: V,
  inferKey: K,
  options?: BoxOptions<Map<K & keyof any, V>>,
): MapBox<K & keyof any, V, Map<K & keyof any, V>> {
  return new MapBox(key, new Map(defaultValue, inferKey as any), options);
}
