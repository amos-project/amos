/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { Entry, IDOf, JSONState, PartialRecord } from 'amos-utils';
import { Map } from './Map';
import { PartialProps, PartialRequiredProps, Record, RecordProps } from './Record';

export class RecordMap<R extends Record<any>, KF extends keyof RecordProps<R>> extends Map<
  IDOf<R[KF]>,
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
  override mergeItem(key: IDOf<R[KF]>, props: PartialProps<R>): this;
  override mergeItem(a: any, b?: any) {
    const props = b ?? a;
    const key = b ? a : a[this.keyField];
    return this.setItem(key, this.getItem(key).merge(props));
  }

  override setAll(
    items: PartialRecord<IDOf<R[KF]>, R> | ReadonlyArray<R | Entry<IDOf<R[KF]>, R>>,
  ): this {
    if (Array.isArray(items)) {
      return super.setAll(items.map((v): any => (Array.isArray(v) ? v : [v[this.keyField], v])));
    } else {
      return super.setAll(items as PartialRecord<IDOf<R[KF]>, R>);
    }
  }

  // resolve types error
  override mergeAll(
    items:
      | ReadonlyArray<Entry<IDOf<R[KF]>, PartialProps<R>>>
      | PartialRecord<IDOf<R[KF]>, PartialProps<R>>,
  ): this;
  override mergeAll(
    items:
      | ReadonlyArray<Entry<IDOf<R[KF]>, PartialProps<R>>>
      | PartialRecord<IDOf<R[KF]>, PartialProps<R>>
      | ReadonlyArray<PartialRequiredProps<R, KF> | Entry<IDOf<R[KF]>, PartialProps<R>>>,
  ): this;
  override mergeAll(
    items:
      | ReadonlyArray<Entry<IDOf<R[KF]>, PartialProps<R>>>
      | PartialRecord<IDOf<R[KF]>, PartialProps<R>>
      | ReadonlyArray<PartialRequiredProps<R, KF> | Entry<IDOf<R[KF]>, PartialProps<R>>>,
  ): this {
    if (Array.isArray(items)) {
      return super.setAll(items.map((v): any => (Array.isArray(v) ? v : [v[this.keyField], v])));
    } else {
      return super.setAll(
        Object.entries(items).map(([k, v]): any => [k, this.getItem(k as IDOf<R[KF]>).merge(v)]),
      );
    }
  }
}

export type RecordMapKeyField<T> = T extends RecordMap<infer R, infer KF> ? KF : never;
export type RecordMapKey<T> = T extends RecordMap<infer R, infer KF> ? R[KF] : never;
export type RecordMapRecord<T> = T extends RecordMap<infer R, infer KF> ? R : never;
export type RecordMapProps<T> = T extends RecordMap<infer R, infer KF> ? RecordProps<R> : never;
