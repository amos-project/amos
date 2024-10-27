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
  type ArraySource,
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
  /** @see RecordMap.setItem */
  setItem(key: RecordMapKey<RM>, value: RecordMapRecord<RM>): Mutation<RM>;
  setItem(value: RecordMapRecord<RM>): Mutation<RM>;
  /** @see RecordMap.mergeItem */
  mergeItem(props: PartialRequiredProps<RecordMapRecord<RM>, RecordMapKeyField<RM>>): Mutation<RM>;
  mergeItem(key: RecordMapKey<RM>, props: PartialProps<RecordMapRecord<RM>>): Mutation<RM>;
  /** @see RecordMap.setAll */
  setAll(
    items:
      | PartialDictionary<RecordMapKey<RM>, RecordMapRecord<RM>>
      | ArraySource<RecordMapRecord<RM> | Entry<RecordMapKey<RM>, RecordMapRecord<RM>>>,
  ): Mutation<RM>;
  /** @see RecordMap.mergeAll */
  mergeAll(
    items:
      | PartialDictionary<RecordMapKey<RM>, PartialProps<RecordMapRecord<RM>>>
      | ArraySource<
          | PartialRequiredProps<RecordMapRecord<RM>, RecordMapKeyField<RM>>
          | Entry<RecordMapKey<RM>, PartialProps<RecordMapRecord<RM>>>
        >,
  ): Mutation<RM>;
  /** @see Record.set */
  setIn<K extends keyof RecordMapProps<RM>>(
    key: RecordMapKey<RM>,
    prop: K,
    value: RecordMapProps<RM>[K],
  ): Mutation<RM>;
  /** @see Record.update */
  updateIn<K extends keyof RecordMapProps<RM>>(
    key: RecordMapKey<RM>,
    prop: K,
    updater: (value: RecordMapProps<RM>[K]) => RecordMapProps<RM>[K],
  ): Mutation<RM>;
  /** @see Record.merge */
  mergeIn(key: RecordMapKey<RM>, props: PartialProps<RecordMapRecord<RM>>): Mutation<RM>;
  /** @see Record.get */
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
