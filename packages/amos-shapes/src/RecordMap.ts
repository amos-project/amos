/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import {
  type ArraySource,
  Entry,
  IDKeyof,
  isIterable,
  JSONState,
  PartialDictionary,
  PartialRecord,
} from 'amos-utils';
import { implementMapDelegations, Map, MapDelegateOperations } from './Map';
import { PartialProps, PartialRequiredProps, Record, RecordProps } from './Record';

export interface RecordMap<R extends Record<any>, KF extends IDKeyof<RecordProps<R>>>
  extends MapDelegateOperations<R[KF], R, 'merge', never, Record<{}>> {
  /** @see Record.set */
  setIn<K extends keyof RecordProps<R>>(key: R[KF], prop: K, value: RecordProps<R>[K]): this;
  /** @see Record.update */
  updateIn<K extends keyof RecordProps<R>>(
    key: R[KF],
    prop: K,
    updater: (v: RecordProps<R>[K], t: R) => RecordProps<R>[K],
  ): this;
  /** @see Record.get */
  getIn<K extends keyof RecordProps<R>>(key: R[KF], prop: K): RecordProps<R>[K];
}

export class RecordMap<R extends Record<any>, KF extends IDKeyof<RecordProps<R>>> extends Map<
  R[KF],
  R
> {
  constructor(
    defaultValue: R,
    readonly keyField: KF,
  ) {
    super(defaultValue);
  }

  // FIX TS2344: Type '{ [x: string]: any; }' is not assignable to type
  // 'JSONState<PartialRecord<R[KF], R>>'
  override fromJS(state: PartialRecord<R[KF], JSONState<RecordProps<R>>>): this {
    return super.fromJS(state as any);
  }

  override setItem(key: R[KF], value: R): this;
  override setItem(value: R): this;
  override setItem(key: any, value?: any) {
    value ??= key;
    key = key === value ? key[this.keyField] : key;
    return super.setItem(key, value);
  }

  override mergeItem(props: PartialRequiredProps<R, KF>): this;
  override mergeItem(key: R[KF], props: PartialProps<R>): this;
  override mergeItem(a: any, b?: any) {
    const props = b ?? a;
    const key = b ? a : a[this.keyField];
    props[this.keyField] = key;
    return this.setItem(key, this.getItem(key).merge(props));
  }

  override setAll(items: PartialDictionary<R[KF], R> | ArraySource<R | Entry<R[KF], R>>): this {
    if (isIterable(items)) {
      items = Array.from(items);
    }
    if (Array.isArray(items)) {
      return super.setAll(items.map((v): any => (Array.isArray(v) ? v : [v[this.keyField], v])));
    } else {
      return super.setAll(items as PartialRecord<R[KF], R>);
    }
  }

  // tricky resolve types error
  override mergeAll(
    items: ArraySource<Entry<R[KF], PartialProps<R>>> | PartialDictionary<R[KF], PartialProps<R>>,
  ): this;
  override mergeAll(
    items: ArraySource<PartialRequiredProps<R, KF> | Entry<R[KF], PartialProps<R>>>,
  ): this;
  override mergeAll(
    items:
      | ArraySource<Entry<R[KF], PartialProps<R>>>
      | PartialDictionary<R[KF], PartialProps<R>>
      | ArraySource<PartialRequiredProps<R, KF> | Entry<R[KF], PartialProps<R>>>,
  ): this {
    if (Array.isArray(items)) {
      return super.setAll(
        items.map((v): any => {
          if (Array.isArray(v)) {
            v[1][this.keyField] = v[0];
            return v;
          }
          return [v[this.keyField], v];
        }),
      );
    } else {
      return super.setAll(
        Object.entries(items).map(([k, v]): any => [k, this.getItem(k as R[KF]).merge(v)]),
      );
    }
  }
}

export type RecordMapKeyField<T> = T extends RecordMap<infer R, infer KF> ? KF : never;
export type RecordMapKey<T> = T extends RecordMap<infer R, infer KF> ? R[KF] : never;
export type RecordMapRecord<T> = T extends RecordMap<infer R, infer KF> ? R : never;
export type RecordMapProps<T> = T extends RecordMap<infer R, infer KF> ? RecordProps<R> : never;

implementMapDelegations(RecordMap, {
  get: 'get',
  set: 'set',
  update: 'set',
  merge: 'set',
});
