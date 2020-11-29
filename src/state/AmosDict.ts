/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import { JSONSerializable, JSONState } from '../core/types';

export type DictKey<V, KF extends keyof V> = V[KF] & (string | number);
export type DictRecord<V, KF extends keyof V> = Partial<Record<DictKey<V, KF>, V>>;

export class AmosDict<V, KF extends keyof V> implements JSONSerializable<DictRecord<V, KF>> {
  private readonly data: DictRecord<V, KF>;

  constructor(
    private readonly defaultValue: V,
    private readonly keyField: KF,
    private readonly data: DictRecord<V, KF> = {},
  ) {}

  private createValue(props: Partial<V>) {}

  getItem(key: V[KF]): V | undefined {
    return this.data[key as DictKey<V, KF>];
  }

  mustGetItem(key: V[KF]): V {
    return this.getItem(key) ?? this.defaultValue;
  }

  mergeItem(key: V[KF], props: Partial<V>): this {}

  toJSON(): DictRecord<V, KF> {
    return this.data;
  }

  fromJSON(state: JSONState<DictRecord<V, KF>>): this {}
}
