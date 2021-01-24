/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import { clone, isJSONSerializable, JSONSerializable, JSONState } from '@kcats/core';
import { createBoxFactory } from './createBoxFactory';
import { fork, forkable } from './utils';

export type DictKey = number | string;

@forkable
export class Dict<K extends DictKey, V> implements JSONSerializable<Record<K, V>> {
  readonly data: Record<K, V>;

  constructor(readonly defaultValue: V, readonly inferKey?: K) {
    this.data = {} as Record<K, V>;
  }

  toJSON(): Record<K, V> {
    return this.data;
  }

  fromJSON(state: JSONState<Record<K, V>> & {}): this {
    const that = clone(this, ({ data: {} } as unknown) as Partial<this>);
    for (const key in state) {
      if (state.hasOwnProperty(key)) {
        if (isJSONSerializable(that.defaultValue)) {
          that.data[(key as unknown) as K] = that.defaultValue.fromJSON(state[key]);
        } else {
          that.data[(key as unknown) as K] = clone(that.defaultValue, state[key]);
        }
      }
    }
    return that;
  }

  size() {
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

  setItems(items: readonly (readonly [K, V])[]): this {
    items.forEach(([key, item]) => {
      this.data[key] = item;
    });
    return fork(this);
  }

  mergeItems(items: readonly (readonly [K, Partial<V>])[]): this {
    items.forEach(([key, item]) => {
      this.data[key] = clone(this.data[key] ?? this.defaultValue, item);
    });
    return fork(this);
  }

  update(key: K, updater: (v: V) => V): this {
    this.data[key] = updater(this.data[key] ?? this.defaultValue);
    return fork(this);
  }

  delete(key: K): this {
    if (!this.data.hasOwnProperty(key)) {
      return this;
    }
    delete this.data[key];
    return fork(this);
  }

  get(key: K): V | undefined {
    return this.data[key];
  }

  take(key: K): V {
    return this.data[key] ?? this.defaultValue;
  }

  has(key: K): boolean {
    return this.data.hasOwnProperty(key);
  }

  keys(): string[] {
    return Object.keys(this.data);
  }

  values(): V[] {
    return Object.values(this.data);
  }

  entities(): [string, V][] {
    return this.keys().map((k) => [k, this.data[k as K]]);
  }

  map<U>(callbackFn: (value: V, key: string, index: number) => U): U[] {
    const result: U[] = [];
    let index = 0;
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        result.push(callbackFn(this.data[key as K], key, index));
      }
    }
    return result;
  }
}

export const createDictBox = createBoxFactory(
  Dict,
  {
    delete: true,
    update: true,
    mergeItems: true,
    setItems: true,
    mergeItem: true,
    setItem: true,
  },
  {
    map: true,
    entities: true,
    values: true,
    keys: true,
    has: false,
    take: false,
    get: false,
    size: true,
  },
);
