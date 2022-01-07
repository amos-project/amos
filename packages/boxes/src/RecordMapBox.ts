/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, BoxOptions, SelectorFactory } from 'amos-core';
import { Record, RecordMap, RecordProps } from 'amos-shapes';
import { FnValue, UnionToIntersection } from 'amos-utils';
import { MapBox } from './MapBox';

export type RelationMap<TBox extends RecordMapBox<any, any, any>> = {
  [name: string]: [
    field: keyof RecordProps<TBox['initialState']['defaultValue']>,
    box?: FnValue<Box<RecordMap<any, any>>>,
  ];
};

export type RelationMethodMap<
  TBox extends RecordMapBox<any, any, any>,
  TRelationMap extends RelationMap<TBox>,
> = {
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
                ? SelectorFactory<[key: RecordProps<TBox['initialState']['defaultValue']>[K]], U>
                : {};
            }
          : {}
        : {};
    }[keyof TRelationMap]
  >;
};

export type RelationMethods<
  TBox extends RecordMapBox<any, any, any>,
  TRelationMap extends RelationMap<TBox>,
> = RelationMethodMap<TBox, TRelationMap> & {
  [K in keyof RelationMethodMap<TBox, TRelationMap>['$relations'] as `get${K &
    string}`]: RelationMethodMap<TBox, TRelationMap>['$relations'][K];
};

export class RecordMapBox<
  V extends Record<any>,
  KF extends keyof RecordProps<V>,
  T extends RecordMap<V, KF>,
> extends MapBox<RecordProps<V>[KF] & keyof any, V, T> {
  relations<TRelationMap extends RelationMap<this>>(
    relationMap: TRelationMap,
  ): this & RelationMethods<this, TRelationMap> {
    const that: this & RelationMethods<this, TRelationMap> = this as any;
    return that;
  }
}

export function createRecordMapBox<V extends Record<any>, KF extends keyof RecordProps<V>>(
  key: string,
  defaultValue: V | (new () => V),
  keyField: KF,
  options?: BoxOptions<RecordMap<V, KF>>,
): RecordMapBox<V, KF, RecordMap<V, KF>> {
  defaultValue = typeof defaultValue === 'function' ? new defaultValue() : defaultValue;
  return new RecordMapBox<V, KF, RecordMap<V, KF>>(
    key,
    new RecordMap(defaultValue, keyField),
    options,
  );
}
