/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, BoxWithStateMethods, Mutation, SelectorFactory } from 'amos-core';
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

export type RecordMapBox<RM extends RecordMap<any, any>> = BoxWithStateMethods<
  RM,
  never,
  never,
  MapBox<RM>
> & {
  relations<TThis, TRelationMap extends RelationMap<TThis>>(
    this: TThis,
    relationMap: TRelationMap,
  ): TThis & RelationMethods<TThis, TRelationMap>;

  setItem(key: MapKey<RM>, value: MapValue<RM>): Mutation<[], RM>;
  setItem(value: MapValue<RM>): Mutation<[], RM>;
  setAll(items: readonly MapValue<RM>[]): Mutation<[], RM>;
  setAll(items: readonly MapPair<RM>[]): Mutation<[], RM>;
  mergeItem(props: PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>): Mutation<[], RM>;
  mergeItem(key: MapKey<RM>, props: PartialProps<MapValue<RM>>): Mutation<[], RM>;
  mergeAll(
    items: readonly PartialRequiredProps<MapValue<RM>, RecordMapKeyField<RM>>[],
  ): Mutation<[], RM>;
  mergeAll(items: readonly Pair<MapKey<RM>, PartialProps<MapValue<RM>>>[]): Mutation<[], RM>;
};

export const RecordMapBox = MapBox.extends({
  mutations: {},
  selectors: {},
  name: 'RecordMapBox',
});

export function createRecordMapBox<R extends Record<any>, KF extends IDKeyof<RecordProps<R>>>(
  key: string,
  defaultValue: CtorValue<R>,
  keyField: KF,
): RecordMapBox<RecordMap<R, KF>> {
  return new RecordMapBox(key, new RecordMap(resolveCtorValue(defaultValue), keyField));
}
