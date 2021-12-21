/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, SelectorFactory } from 'amos-amos';
import { UnionToIntersection } from '../core/types';
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

  override merge(key: V[KF] & keyof any, props: Partial<V>): this;
  override merge(props: PartialRequiredProps<V, KF>): this;
  override merge(key: any, value?: any) {
    value ??= key;
    key = key === value ? key[this.keyField] : key;
    return this.set(key, this.get(key).merge(value));
  }

  override mergeAll(items: readonly []) {
    // FIXME
  }
}

export type RelationMap<TBox extends Box<EntityMap<any, any>>> = {
  [P: string]: [keyof EntityProps<TBox['initialState']['defaultValue']>, Box<EntityMap<any, any>>];
};

export type RelationMethods<
  TBox extends Box<EntityMap<any, any>>,
  TRelationMap extends RelationMap<TBox>,
  TPrefix extends string = '',
> = (TPrefix extends ''
  ? {
      $relations: TRelationMap;
    }
  : {}) & {
  [P in keyof TRelationMap as `get${Capitalize<`${TPrefix}${Capitalize<`${P &
    string}`>}`>}`]: TRelationMap[P] extends [infer K, Box<EntityMap<infer E, any>>]
    ? K extends keyof EntityProps<TBox['initialState']['defaultValue']>
      ? SelectorFactory<[key: EntityProps<TBox['initialState']['defaultValue']>[K]], E>
      : never
    : never;
} & UnionToIntersection<
    {
      [P in keyof TRelationMap]: TRelationMap[P] extends [
        infer K,
        { $relations: infer TRelationMapDeep },
      ]
        ? TRelationMapDeep extends RelationMap<infer TBoxDeep>
          ? RelationMethods<TBoxDeep, TRelationMapDeep, `${TPrefix}${Capitalize<P & string>}`>
          : { [S in `unknown_${P & string}`]: number }
        : { [S in `failed_${P & string}`]: number };
    }[keyof TRelationMap]
  >;

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
