/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import { isJSONSerializable, JSONSerializable, JSONState } from '../core/types';
import { clone } from '../core/utils';
import { createBoxFactory } from './createBoxFactory';
import { fork, forkable } from './utils';

export type DictKey = number | string;

@forkable
export class AmosDict<K, V> implements JSONSerializable<Record<K & DictKey, V>> {
  protected readonly data: Record<K & DictKey, V>;

  constructor(inferKey: K, protected readonly defaultValue: V) {
    this.data = {} as Record<K & DictKey, V>;
  }

  toJSON(): Record<K & DictKey, V> {
    return this.data;
  }

  fromJSON(state: JSONState<Record<K & DictKey, V>> & {}): this {
    const that = clone(this, ({ data: {} } as unknown) as Partial<this>);
    for (const key in state) {
      if (state.hasOwnProperty(key)) {
        if (isJSONSerializable(that.defaultValue)) {
          that.data[(key as unknown) as K & DictKey] = that.defaultValue.fromJSON(state[key]);
        } else {
          that.data[(key as unknown) as K & DictKey] = clone(that.defaultValue, state[key]);
        }
      }
    }
    return that;
  }

  size() {
    return Object.keys(this.data).length;
  }

  setItem(key: K & DictKey, item: V): this {
    this.data[key] = item;
    return fork(this);
  }

  mergeItem(key: K & DictKey, props: Partial<V>): this {
    this.data[key] = clone(this.data[key] ?? this.defaultValue, props);
    return fork(this);
  }

  setItems(items: readonly (readonly [K & DictKey, V])[]): this {
    items.forEach(([key, item]) => {
      this.data[key] = item;
    });
    return fork(this);
  }

  mergeItems(items: readonly (readonly [K & DictKey, Partial<V>])[]): this {
    items.forEach(([key, item]) => {
      this.data[key] = clone(this.data[key] ?? this.defaultValue, item);
    });
    return fork(this);
  }

  update(key: K & DictKey, updater: (v: V) => V): this {
    this.data[key] = updater(this.data[key] ?? this.defaultValue);
    return fork(this);
  }

  delete(key: K & DictKey): this {
    if (!this.data.hasOwnProperty(key)) {
      return this;
    }
    delete this.data[key];
    return fork(this);
  }

  get(key: K & DictKey): V | undefined {
    return this.data[key];
  }

  take(key: K & DictKey): V {
    return this.data[key] ?? this.defaultValue;
  }

  has(key: K & DictKey): boolean {
    return this.data.hasOwnProperty(key);
  }

  keys(): string[] {
    return Object.keys(this.data);
  }

  values(): V[] {
    return Object.values(this.data);
  }

  entities(): [string, V][] {
    return this.keys().map((k) => [k, this.data[k as K & DictKey]]);
  }

  map<U>(callbackFn: (value: V, key: string, index: number) => U): U[] {
    const result: U[] = [];
    let index = 0;
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        result.push(callbackFn(this.data[key as K & DictKey], key, index));
      }
    }
    return result;
  }
}

export const createDictBox = createBoxFactory(
  AmosDict,
  ['delete', 'update', 'mergeItems', 'setItems', 'mergeItem', 'setItem'] as const,
  ['map', 'entities', 'values', 'keys', 'has', 'take', 'get', 'size'] as const,
);
