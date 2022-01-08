/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, BoxOptions, SelectorFactory } from 'amos-core';
import { Record, RecordMap, RecordMapKeyField, RecordProps } from 'amos-shapes';
import { CtorValue, FnValue, IDKeyof, IDOf, UnionToIntersection } from 'amos-utils';
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

export class RecordMapBox<S extends RecordMap<any, any, any>> extends MapBox<
  RecordMapKeyField<any>
> {
  relations<TRelationMap extends RelationMap<this>>(
    relationMap: TRelationMap,
  ): this & RelationMethods<this, TRelationMap> {
    const that: this & RelationMethods<this, TRelationMap> = this as any;
    return that;
  }
}

export function createRecordMapBox<R extends Record<any>, KF extends keyof RecordProps<R>>(
  key: string,
  defaultValue: CtorValue<R>,
  keyField: KF,
) {
  defaultValue = typeof defaultValue === 'function' ? new defaultValue() : defaultValue;
  return new RecordMapBox<RecordProps<R>, KF, R, RecordMap<RecordProps<any>, any, any>>(
    key,
    new RecordMap(defaultValue, keyField),
    options,
  );
}
