/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, Mutation, Selector, ShapeBox } from 'amos-core';
import {
  PartialProps,
  PartialRequiredProps,
  Record,
  RecordMap,
  RecordMapKey,
  RecordMapKeyField,
  RecordMapProps,
  RecordMapRecord,
  RecordProps,
} from 'amos-shapes';
import {
  Entry,
  IDKeyof,
  PartialDictionary,
  resolveConstructorValue,
  ValueOrConstructor,
} from 'amos-utils';
import { MapBox } from './mapBox';

export interface RecordMapBox<RM extends RecordMap<any, any> = RecordMap<any, any>>
  extends Omit<MapBox<RM>, 'setItem' | 'mergeItem' | 'mergeAll' | 'setAll' | keyof Box>,
    Box<RM>,
    ShapeBox<RM, never, never, RecordMap<any, any>> {
  setItem(key: RecordMapKey<RM>, value: RecordMapRecord<RM>): Mutation<RM>;
  setItem(value: RecordMapRecord<RM>): Mutation<RM>;
  /** {@link RecordMap.mergeItem} */
  mergeItem(props: PartialRequiredProps<RecordMapRecord<RM>, RecordMapKeyField<RM>>): Mutation<RM>;
  mergeItem(key: RecordMapKey<RM>, props: PartialProps<RecordMapRecord<RM>>): Mutation<RM>;
  /** {@link RecordMap.setAll} */
  setAll(
    items:
      | PartialDictionary<RecordMapKey<RM>, RecordMapRecord<RM>>
      | ReadonlyArray<RecordMapKey<RM> | Entry<RecordMapKey<RM>, RecordMapRecord<RM>>>,
  ): Mutation<RM>;
  mergeAll(
    items:
      | PartialDictionary<RecordMapKey<RM>, PartialProps<RecordMapRecord<RM>>>
      | ReadonlyArray<
          | PartialRequiredProps<RecordMapRecord<RM>, RecordMapKeyField<RM>>
          | Entry<RecordMapKey<RM>, PartialProps<RecordMapRecord<RM>>>
        >,
  ): Mutation<RM>;
  setIn<K extends keyof RecordMapProps<RM>>(
    key: RecordMapKey<RM>,
    prop: K,
    value: RecordMapProps<RM>[K],
  ): Mutation<RM>;
  updateIn<K extends keyof RecordMapProps<RM>>(
    key: RecordMapKey<RM>,
    prop: K,
    updater: (value: RecordMapProps<RM>[K]) => RecordMapProps<RM>[K],
  ): Mutation<RM>;
  mergeIn<K extends keyof RecordMapProps<RM>>(
    key: RecordMapKey<RM>,
    props: PartialProps<RecordMapRecord<RM>>,
  ): Mutation<RM>;
  getIn<K extends keyof RecordMapProps<RM>>(
    key: RecordMapKey<RM>,
    prop: K,
  ): Selector<[key: RecordMapKey<RM>, prop: K], RM>;
}

export const RecordMapBox = MapBox.extends<RecordMapBox>({
  name: 'RecordMapBox',
  mutations: {
    setIn: null,
    updateIn: null,
    mergeIn: null,
  },
  selectors: {
    getIn: null,
  },
});

export function recordMapBox<R extends Record<any>, KF extends IDKeyof<RecordProps<R>>>(
  key: string,
  defaultValue: ValueOrConstructor<R>,
  keyField: KF,
): RecordMapBox<RecordMap<R, KF>> {
  return new RecordMapBox(key, new RecordMap(resolveConstructorValue(defaultValue), keyField));
}
