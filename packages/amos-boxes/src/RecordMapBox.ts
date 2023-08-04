/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, BoxFactoryStatic, Mutation, SelectorFactory, ShapedBox } from 'amos-core';
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
import {
  CtorValue,
  FnValue,
  IDKeyof,
  Pair,
  resolveCtorValue,
  UnionToIntersection,
} from 'amos-utils';
import { MapBox } from './MapBox';

export type RelationMap<TBox> = TBox extends Box
  ? {
      [name: string]: [
        field: keyof RecordProps<TBox['initialState']['defaultValue']>,
        box?: FnValue<Box<RecordMap<any, any>>>,
      ];
    }
  : {};

export type RelationMethodMap<TBox, TRelationMap extends RelationMap<TBox>> = TBox extends Box
  ? {
      $relations: {
        [P in keyof TRelationMap as `${Capitalize<`${P & string}`>}`]: TRelationMap[P] extends [
          infer K,
          FnValue<Box<RecordMap<infer E, any>>>,
        ]
          ? K extends keyof RecordProps<TBox['initialState']['defaultValue']>
            ? SelectorFactory<[key: RecordProps<TBox['initialState']['defaultValue']>[K]], E>
            : never
          : never;
      } & UnionToIntersection<
        {
          [P in keyof TRelationMap]: TRelationMap[P] extends [
            infer K,
            FnValue<Box<RecordMap<infer E, any>> & { $relations: infer TRelationMap2 }>,
          ]
            ? K extends keyof RecordProps<TBox['initialState']['defaultValue']>
              ? {
                  [P2 in keyof TRelationMap2 as `${Capitalize<P & string>}${P2 &
                    string}`]: TRelationMap2[P2] extends SelectorFactory<[infer KT], infer U>
                    ? SelectorFactory<
                        [key: RecordProps<TBox['initialState']['defaultValue']>[K]],
                        U
                      >
                    : {};
                }
              : {}
            : {};
        }[keyof TRelationMap]
      >;
    }
  : {
      $relations: {};
    };

export type RelationMethods<TBox, TRelationMap extends RelationMap<TBox>> = RelationMethodMap<
  TBox,
  TRelationMap
> & {
  [K in keyof RelationMethodMap<TBox, TRelationMap>['$relations'] as `get${K &
    string}`]: RelationMethodMap<TBox, TRelationMap>['$relations'][K];
};

export interface RecordMapBox<RM extends RecordMap<any, any> = RecordMap<any, any>>
  extends ShapedBox<
    RM,
    never,
    never,
    Omit<MapBox<RM>, 'setItem' | 'setAll' | 'mergeItem' | 'mergeAll'>,
    RecordMap<any, any>
  > {
  relations<TRelationMap extends RelationMap<this>>(
    relationMap: TRelationMap,
  ): this & RelationMethods<this, TRelationMap>;

  setItem(
    key: MapKey<RM>,
    value: MapValue<RM>,
  ): Mutation<[key: MapKey<RM>, value: MapValue<RM>], RM>;
  setItem(value: MapValue<RM>): Mutation<[value: MapValue<RM>], RM>;
  setAll(items: readonly MapPair<RM>[]): Mutation<[items: readonly MapPair<RM>[]], RM>;
  setAll(items: readonly MapValue<RM>[]): Mutation<[items: readonly MapValue<RM>[]], RM>;
  mergeItem(
    props: PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>,
  ): Mutation<[props: PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>], RM>;
  mergeItem(
    key: MapKey<RM>,
    props: PartialProps<MapValue<RM>>,
  ): Mutation<[key: MapKey<RM>, props: PartialProps<MapValue<RM>>], RM>;
  mergeAll(
    items: readonly PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>[],
  ): Mutation<[items: readonly PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>[]], RM>;
  mergeAll(
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
  methods: {
    relations(relationMap: RelationMap<any>) {
      return this as any;
    },
  },
});

export function createRecordMapBox<R extends Record<any>, KF extends IDKeyof<RecordProps<R>>>(
  key: string,
  defaultValue: CtorValue<R>,
  keyField: KF,
): RecordMapBox<RecordMap<R, KF>> {
  return new RecordMapBox(key, new RecordMap(resolveCtorValue(defaultValue), keyField));
}
