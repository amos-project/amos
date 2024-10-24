/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, Mutation, ShapeBox } from 'amos-core';
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
import { IDKeyof, resolveCtorValue, ValueOrConstructor } from 'amos-utils';
import { MapBox } from './mapBox';

export interface RecordMapBox<RM extends RecordMap<any, any> = RecordMap<any, any>>
  extends Omit<MapBox<RM>, 'setItem' | 'mergeItem' | keyof Box>,
    Box<RM>,
    ShapeBox<RM, 'setAll' | 'mergeAll', never, RecordMap<Record<{}>, never>> {
  setItem(key: MapKey<RM>, value: MapValue<RM>): Mutation<RM>;
  setItem(value: MapValue<RM>): Mutation<RM>;
  mergeItem(props: PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>): Mutation<RM>;
  mergeItem(key: MapKey<RM>, props: PartialProps<MapValue<RM>>): Mutation<RM>;
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
