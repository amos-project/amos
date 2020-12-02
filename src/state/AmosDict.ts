/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import { isJSONSerializable, JSONSerializable, JSONState } from '../core/types';
import { createBoxFactory } from './createBoxFactory';
import { clone, fork, forkable } from './immutable_utils';

@forkable
export class AmosDict<K extends string | number, V> implements JSONSerializable<Record<K, V>> {
  protected readonly data: Record<K, V>;

  constructor(private readonly defaultValue: V) {
    this.data = {} as Record<K, V>;
  }

  get size() {
    return Object.keys(this.data).length;
  }

  setItem(key: K, item: V): this {
    this.data[key] = item;
    return fork(this);
  }

  mergeItem(key: K, props: Partial<V>): this {
    this.data[key] = clone(this.data[key] ?? this.defaultValue, props);
    return fork(this);
  }

  setItems(items: readonly V[]): this {
    items.forEach((item) => {
      const key = (item[this.keyField] as unknown) as K;
      this.data[key] = item;
    });
    return fork(this);
  }

  mergeItems(items: Array<Partial<V> & Pick<V, KF>>): this {
    items.forEach((item) => {
      const key = (item[this.keyField] as unknown) as K;
      this.data[key] = clone(this.data[key] ?? this.defaultValue, item);
    });
    return fork(this);
  }

  updateItem(key: K, updater: (v: V) => V): this {
    this.data[key] = updater(this.data[key] ?? this.defaultValue);
    return fork(this);
  }

  deleteItem(key: K): this {
    delete this.data[key];
    return fork(this);
  }

  keys(): string[] {
    return Object.keys(this.data);
  }

  values(): V[] {
    return Object.values(this.data);
  }

  getItem(key: K): V | undefined {
    return this.data[key];
  }

  mustGetItem(key: K): V {
    return this.data[key] ?? this.defaultValue;
  }

  toJSON(): Record<K, V> {
    return this.data;
  }

  fromJSON(state: JSONState<Record<K, V>>): this {
    const that = clone(this, { data: {} } as any);
    for (const key in state) {
      if (isJSONSerializable(that.defaultValue)) {
        that.data[(key as unknown) as K] = that.defaultValue.fromJSON(state[key]);
      } else {
        that.data[(key as unknown) as K] = clone(that.defaultValue, state[key]);
      }
    }
    return that;
  }
}

export const createDictBox = createBoxFactory(
  AmosDict,
  ['setItem', 'mergeItem', 'setItems', 'mergeItems', 'updateItem', 'deleteItem'] as const,
  ['getItem', 'mustGetItem', 'keys', 'values'] as const,
);
