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
  constructor(readonly defaultValue: R, readonly keyField: KF) {
    super(defaultValue);
  }

  // FIX TS2344: Type '{ [x: string]: any; }' is not assignable to type
  // 'JSONState<PartialRecord<R[KF], R>>'
  override fromJSON(state: PartialRecord<R[KF], JSONState<RecordProps<R>>>): this {
    return super.fromJSON(state as any);
  }

  override setItem(key: R[KF], value: R): this;
  override setItem(value: R): this;
  override setItem(key: any, value?: any) {
    value ??= key;
    key = key === value ? key[this.keyField] : key;
    return super.setItem(key, value);
  }

  override setAll(items: readonly R[]): this;
  override setAll(items: readonly Pair<R[KF], R>[]): this;
  override setAll(items: readonly any[]): this {
    return super.setAll(
      items.map((value) => {
        return Array.isArray(value) ? value : [value[this.keyField], value];
      }) as any[],
    );
  }

  override mergeItem(props: PartialRequiredProps<R, KF>): this;
  override mergeItem(key: R[KF], props: PartialProps<R>): this;
  override mergeItem(key: any, value?: any) {
    value ??= key;
    key = key === value ? key[this.keyField] : key;
    return this.setItem(key, this.getItem(key).merge(value));
  }

  override mergeAll(items: readonly PartialRequiredProps<R, KF>[]): this;
  override mergeAll(items: readonly Pair<R[KF], PartialProps<R>>[]): this;
  override mergeAll(items: any[]): this {
    if (Array.isArray(items[0])) {
      return super.setAll(
        items.map(([key, value]) => {
          value[this.keyField] = key;
          return [key, this.getItem(key).merge(value)];
        }),
      );
    } else {
      return super.setAll(
        items.map((value) => [
          value[this.keyField],
          this.getItem(value[this.keyField]).merge(value),
        ]),
      );
    }
  }
}

export type RecordMapKeyField<T> = T extends RecordMap<infer R, infer KF> ? KF : never;
export type RecordMapKey<T> = T extends RecordMap<infer R, infer KF> ? R[KF] : never;
export type RecordMapRecord<T> = T extends RecordMap<infer R, infer KF> ? R : never;
export type RecordMapProps<T> = T extends RecordMap<infer R, infer KF> ? RecordProps<R> : never;
