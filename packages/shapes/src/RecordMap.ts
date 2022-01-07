/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { ID, IDKeyof, Pair, PartialRequired } from 'amos-utils';
import { Map } from './Map';
import { Record } from './Record';

export class RecordMap<P extends object, KF extends IDKeyof<P>, R extends Record<P>> extends Map<
  P[KF] & ID,
  R
> {
  constructor(readonly defaultValue: R, readonly keyField: KF) {
    super(defaultValue, defaultValue.get(keyField) as P[KF] & ID);
  }

  override set(key: P[KF] & ID, value: R): this;
  override set(value: R): this;
  override set(key: any, value?: any) {
    value ??= key;
    key = key === value ? key[this.keyField] : key;
    return super.set(key, value);
  }

  override setAll(items: readonly Pair<P[KF] & ID, R>[]): this;
  override setAll(items: readonly R[]): this;
  override setAll(items: readonly any[]): this {
    return super.setAll(
      items.map((value) => {
        return Array.isArray(value) ? value : [value[this.keyField], value];
      }) as any[],
    );
  }

  override merge(key: P[KF] & ID, props: Partial<P>): this;
  override merge(props: PartialRequired<P, KF>): this;
  override merge(key: any, value?: any) {
    value ??= key;
    key = key === value ? key[this.keyField] : key;
    return this.set(key, this.get(key).merge(value));
  }

  override mergeAll(items: readonly Pair<P[KF] & ID, Partial<P>>[]): this;
  override mergeAll(items: readonly PartialRequired<P, KF>[]): this;
  override mergeAll(items: any[]): this {
    if (Array.isArray(items[0])) {
      return super.setAll(
        items.map(([key, value]) => {
          value[this.keyField] = key;
          return [key, this.get(key).merge(value)];
        }),
      );
    } else {
      return super.setAll(
        items.map((value) => [value[this.keyField], this.get(value[this.keyField]).merge(value)]),
      );
    }
  }
}

export type RecordMapKeyField<T> = T extends RecordMap<infer P, infer KF, infer R> ? KF : never;
export type RecordMapRecord<T> = T extends RecordMap<infer P, infer KF, infer R> ? R : never;
export type RecordMapProps<T> = T extends RecordMap<infer P, infer KF, infer R> ? P : never;
