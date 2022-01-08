/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import {
  clone,
  ID,
  isJSONSerializable,
  JSONSerializable,
  JSONState,
  Pair,
  PartialRecord,
  StorageMap,
  ToString,
} from 'amos-utils';

export class Map<K extends ID, V>
  implements JSONSerializable<PartialRecord<K, V>>, StorageMap<K, V>
{
  readonly data: PartialRecord<K, V> = {};

  constructor(readonly defaultValue: V) {}

  toJSON(): PartialRecord<K, V> {
    return this.data;
  }

  fromJSON(state: JSONState<PartialRecord<K, V>>): this {
    const that = clone(this, { data: {} } as any);
    for (const key in state) {
      if (isJSONSerializable(that.defaultValue)) {
        that.data[key as unknown as K] = that.defaultValue.fromJSON(state[key]);
      } else {
        that.data[key as unknown as K] = clone(that.defaultValue, state[key]);
      }
    }
    return that;
  }

  size() {
    return Object.keys(this.data).length;
  }

  keys(): ToString<K>[] {
    return Object.keys(this.data) as ToString<K>[];
  }

  hasItem(key: K): boolean {
    return this.data.hasOwnProperty(key);
  }

  getItem(key: K): V {
    return this.data[key] ?? this.defaultValue;
  }

  setItem(key: K, item: V): this {
    if (this.getItem(key) === item) {
      return this;
    }
    return clone(this, {
      data: {
        ...this.data,
        [key]: item,
      },
    } as any);
  }

  mergeItem(key: K, props: Partial<V>): this {
    const value = this.getItem(key);
    for (const key in props) {
      if (value[key] !== props[key]) {
        return clone(this, {
          data: {
            ...this.data,
            [key]: clone(value, props),
          },
        } as any);
      }
    }
    return this;
  }

  setAll(items: readonly Pair<K, V>[]): this {
    items = items.filter(([key, value]) => this.getItem(key) !== value);
    if (items.length === 0) {
      return this;
    }
    return clone(this, {
      data: {
        ...this.data,
        ...items.reduce((prev, now) => {
          prev[now[0]] = now[1];
          return prev;
        }, {} as Record<K, V>),
      },
    } as any);
  }

  mergeAll(items: readonly Pair<K, Partial<V>>[]): this {
    items = items.filter(([key, props]) => {
      const value = this.getItem(key);
      for (const p in props) {
        if (value[p] !== props[p]) {
          return true;
        }
      }
      return false;
    });
    if (items.length === 0) {
      return this;
    }
    return clone(this, {
      data: {
        ...this.data,
        ...items.reduce((prev, now) => {
          prev[now[0]] = clone(this.getItem(now[0]), now[1]);
          return prev;
        }, {} as Record<K, V>),
      },
    } as any);
  }

  updateItem(key: K, updater: (v: V) => V): this {
    return this.setItem(key, updater(this.getItem(key)));
  }

  removeItem(key: K): this {
    if (!this.hasItem(key)) {
      return this;
    }
    const that = clone(this, { data: { ...this.data } } as any);
    delete that.data[key];
    return that;
  }

  clear(): this {
    return clone(this, { data: {} } as {});
  }

  map<U>(callbackFn: (value: V, key: ToString<K>, index: number) => U): U[] {
    const result: U[] = [];
    let index = 0;
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        result.push(callbackFn(this.data[key as K]!, key as ToString<K>, index++));
      }
    }
    return result;
  }
}

export type MapKey<T> = T extends Map<infer K, infer V> ? K : never;
export type MapValue<T> = T extends Map<infer K, infer V> ? V : never;
export type MapPair<T> = T extends Map<infer K, infer V> ? Pair<K, V> : never;
