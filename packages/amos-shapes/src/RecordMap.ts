/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { IDOf, JSONState, Pair, PartialRecord } from 'amos-utils';
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

  override set(key: R[KF], value: R): this;
  override set(value: R): this;
  override set(key: any, value?: any) {
    value ??= key;
    key = key === value ? key[this.keyField] : key;
    return super.set(key, value);
  }

  override setAll(items: PartialRecord<R[KF], R>): this;
  override setAll(items: readonly R[]): this;
  override setAll(items: readonly Pair<R[KF], R>[]): this;
  override setAll(items: any): this {
    if (!Array.isArray(items)) {
      return super.setAll(items);
    }
    return super.setAll(
      items.map((value: R | [R[KF], R]) => {
        return Array.isArray(value) ? value : [value[this.keyField], value];
      }) as any[],
    );
  }

  override mergeItem(props: PartialRequiredProps<R, KF>): this;
  override mergeItem(key: R[KF], props: PartialProps<R>): this;
  override mergeItem(key: any, value?: any) {
    value ??= key;
    key = key === value ? key[this.keyField] : key;
    return this.set(key, this.getOrDefault(key).merge(value));
  }

  override merge(items: PartialRecord<R[KF], PartialProps<R>>): this;
  override merge(items: readonly Pair<R[KF], PartialProps<R>>[]): this;
  override merge(items: readonly PartialRequiredProps<R, KF>[]): this;
  override merge(items: any[]): this {
    const data = Array.isArray(items) ? items : Object.entries(items);
    return super.setAll(
      data.map((item): [R[KF], R] => {
        const [key, props] = Array.isArray(item) ? item : [item[this.keyField], item];
        return [key, this.getOrDefault(key).merge(props)];
      }),
    );
  }
}

export type RecordMapKeyField<T> = T extends RecordMap<infer R, infer KF> ? KF : never;
export type RecordMapKey<T> = T extends RecordMap<infer R, infer KF> ? R[KF] : never;
export type RecordMapRecord<T> = T extends RecordMap<infer R, infer KF> ? R : never;
export type RecordMapProps<T> = T extends RecordMap<infer R, infer KF> ? RecordProps<R> : never;
