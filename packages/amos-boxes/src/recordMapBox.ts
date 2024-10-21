/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Mutation, ShapeBox } from 'amos-core';
import {
  MapKey,
  MapValue,
  PartialProps,
  PartialRequiredProps,
  Record,
  RecordMap,
  RecordMapKeyField,
  RecordProps,
} from 'amos-shapes';
import { IDKeyof, OmitKeys, resolveCtorValue, ValueOrConstructor } from 'amos-utils';
import { MapBox } from './mapBox';

export interface RecordMapBox<RM extends RecordMap<any, any> = RecordMap<any, any>>
  extends ShapeBox<
    RM,
    'setAll' | 'mergeAll',
    never,
    OmitKeys<MapBox<RM>, 'setItem' | 'setAll' | 'mergeItem'>,
    RecordMap<Record<{}>, never>
  > {
  setItem(
    key: MapKey<RM>,
    value: MapValue<RM>,
  ): Mutation<[key: MapKey<RM>, value: MapValue<RM>], RM>;
  setItem(value: MapValue<RM>): Mutation<[value: MapValue<RM>], RM>;
  mergeItem(
    props: PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>,
  ): Mutation<[props: PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>], RM>;
  mergeItem(
    key: MapKey<RM>,
    props: PartialProps<MapValue<RM>>,
  ): Mutation<[key: MapKey<RM>, props: PartialProps<MapValue<RM>>], RM>;
}

export const RecordMapBox = MapBox.extends<RecordMapBox>({
  name: 'RecordMapBox',
  mutations: {},
  selectors: {},
});

export function recordMapBox<R extends Record<any>, KF extends IDKeyof<RecordProps<R>>>(
  key: string,
  defaultValue: ValueOrConstructor<R>,
  keyField: KF,
): RecordMapBox<RecordMap<R, KF>> {
  return new RecordMapBox(key, new RecordMap(resolveCtorValue(defaultValue), keyField));
}
