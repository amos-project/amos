/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { BoxFactoryStatic, Mutation, ShapedBox } from 'amos-core';
import {
  MapKey,
  MapPair,
  MapValue,
  PartialProps,
  PartialRequiredProps,
  Record,
  RecordMap,
  RecordMapKeyField,
  RecordProps,
} from 'amos-shapes';
import { IDKeyof, OmitKeys, Pair, resolveCtorValue, ValueOrConstructor } from 'amos-utils';
import { MapBox } from './MapBox';

export interface RecordMapBox<RM extends RecordMap<any, any> = RecordMap<any, any>>
  extends ShapedBox<
    RM,
    never,
    never,
    OmitKeys<MapBox<RM>, 'set' | 'setAll' | 'merge' | 'mergeItem'>,
    RecordMap<Record<{}>, never>
  > {
  set(key: MapKey<RM>, value: MapValue<RM>): Mutation<[key: MapKey<RM>, value: MapValue<RM>], RM>;
  set(value: MapValue<RM>): Mutation<[value: MapValue<RM>], RM>;
  setAll(items: readonly MapPair<RM>[]): Mutation<[items: readonly MapPair<RM>[]], RM>;
  setAll(items: readonly MapValue<RM>[]): Mutation<[items: readonly MapValue<RM>[]], RM>;

  mergeItem(
    props: PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>,
  ): Mutation<[props: PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>], RM>;
  mergeItem(
    key: MapKey<RM>,
    props: PartialProps<MapValue<RM>>,
  ): Mutation<[key: MapKey<RM>, props: PartialProps<MapValue<RM>>], RM>;
  merge(
    items: readonly PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>[],
  ): Mutation<[items: readonly PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>[]], RM>;
  merge(
    items: readonly Pair<MapKey<RM>, PartialProps<MapValue<RM>>>[],
  ): Mutation<[items: readonly Pair<MapKey<RM>, PartialProps<MapValue<RM>>>[]], RM>;
}

export interface RecordMapBoxFactory extends BoxFactoryStatic<RecordMapBox> {
  new <RM extends RecordMap<any, any>>(key: string, initialState: RM): RecordMapBox<RM>;
}

export const RecordMapBox: RecordMapBoxFactory = MapBox.extends<RecordMapBox<any>>({
  name: 'RecordMapBox',
  mutations: {},
  selectors: {},
});

export function createRecordMapBox<R extends Record<any>, KF extends IDKeyof<RecordProps<R>>>(
  key: string,
  defaultValue: ValueOrConstructor<R>,
  keyField: KF,
): RecordMapBox<RecordMap<R, KF>> {
  return new RecordMapBox(key, new RecordMap(resolveCtorValue(defaultValue), keyField));
}
