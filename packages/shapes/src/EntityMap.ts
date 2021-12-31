/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, SelectorFactory } from 'amos-amos';
import { FnValue, UnionToIntersection } from '../../core/src/types';
import { EntityInstance, EntityProps, PartialRequiredProps } from './Entity';
import { createMapBox, Map } from './Map';

export class EntityMap<V extends EntityInstance<any>, KF extends keyof EntityProps<V>> extends Map<
  V[KF] & keyof any,
  V
> {
  constructor(readonly defaultValue: V, readonly keyField: KF) {
    super(defaultValue, defaultValue[keyField]);
  }

  override set(key: V[KF] & keyof any, value: V): this;
  override set(value: V): this;
  override set(key: any, value?: any) {
    value ??= key;
    key = key === value ? key[this.keyField] : key;
    return super.set(key, value);
  }

  merge(key: V[KF] & keyof any, props: Partial<V>): this;
  merge(props: PartialRequiredProps<V, KF>): this;
  merge(key: any, value?: any) {
    value ??= key;
    key = key === value ? key[this.keyField] : key;
    return this.set(key, this.get(key).merge(value));
  }

  override mergeAll(items: readonly []) {
    // FIXME
  }
}

export type RelationMap<TBox extends Box<EntityMap<any, any>>> = {
  [P: string]: [
    keyof EntityProps<TBox['initialState']['defaultValue']>,
    FnValue<Box<EntityMap<any, any>>>,
  ];
};

export type RelationMethodMap<
  TBox extends Box<EntityMap<any, any>>,
  TRelationMap extends RelationMap<TBox>,
> = {
  $relations: {
    [P in keyof TRelationMap as `${Capitalize<`${P & string}`>}`]: TRelationMap[P] extends [
      infer K,
      FnValue<Box<EntityMap<infer E, any>>>,
    ]
      ? K extends keyof EntityProps<TBox['initialState']['defaultValue']>
        ? SelectorFactory<[key: EntityProps<TBox['initialState']['defaultValue']>[K]], E>
        : never
      : never;
  } & UnionToIntersection<
    {
      [P in keyof TRelationMap]: TRelationMap[P] extends [
        infer K,
        FnValue<Box<EntityMap<infer E, any>> & { $relations: infer TRelationMap2 }>,
      ]
        ? K extends keyof EntityProps<TBox['initialState']['defaultValue']>
          ? {
              [P2 in keyof TRelationMap2 as `${Capitalize<P & string>}${P2 &
                string}`]: TRelationMap2[P2] extends SelectorFactory<[infer KT], infer U>
                ? SelectorFactory<[key: EntityProps<TBox['initialState']['defaultValue']>[K]], U>
                : {};
            }
          : {}
        : {};
    }[keyof TRelationMap]
  >;
};

export type RelationMethods<
  TBox extends Box<EntityMap<any, any>>,
  TRelationMap extends RelationMap<TBox>,
> = RelationMethodMap<TBox, TRelationMap> & {
  [K in keyof RelationMethodMap<TBox, TRelationMap>['$relations'] as `get${K &
    string}`]: RelationMethodMap<TBox, TRelationMap>['$relations'][K];
};

export const createEntityMapBox = createMapBox.extend(EntityMap, {
  mutations: {},
  selectors: {},
  methods: {
    relations<TBox extends Box<EntityMap<any, any>>, TRelationMap extends RelationMap<TBox>>(
      this: TBox,
      relationMap: TRelationMap,
    ): TBox & RelationMethods<TBox, TRelationMap> {
      return this as any;
    },
  },
});
