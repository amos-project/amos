/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import {
  clone,
  IDOf,
  isJSONSerializable,
  JSONSerializable,
  JSONState,
  Pair,
  PartialRecord,
  ToString,
} from 'amos-utils';

export class Map<K, V> implements JSONSerializable<PartialRecord<IDOf<K>, V>> {
  readonly data: PartialRecord<IDOf<K>, V>;

  constructor(readonly defaultValue: V, readonly inferKey?: K) {
    this.data = {} as Record<IDOf<K>, V>;
  }

  toJSON(): PartialRecord<IDOf<K>, V> {
    return this.data;
  }

  fromJSON(state: JSONState<PartialRecord<IDOf<K>, V>>): this {
    const that = clone(this, { data: {} } as any);
    for (const key in state) {
      if (isJSONSerializable(that.defaultValue)) {
        that.data[key as unknown as IDOf<K>] = that.defaultValue.fromJSON(state[key]);
      } else {
        that.data[key as unknown as IDOf<K>] = clone(that.defaultValue, state[key]);
      }
    }
    return that;
  }

  size() {
    return Object.keys(this.data).length;
  }

  has(key: IDOf<K>): boolean {
    return this.data.hasOwnProperty(key);
  }

  get(key: IDOf<K>): V {
    return this.data[key] ?? this.defaultValue;
  }

  keys(): ToString<K>[] {
    return Object.keys(this.data) as ToString<K>[];
  }

  values(): V[] {
    return Object.values(this.data);
  }

  entities(): Pair<ToString<K>, V>[] {
    return this.keys().map((k) => [k as ToString<K>, this.data[k as IDOf<K>]!]);
  }

  map<U>(callbackFn: (value: V, key: ToString<K>, index: number) => U): U[] {
    const result: U[] = [];
    let index = 0;
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        result.push(callbackFn(this.data[key as IDOf<K>]!, key as ToString<K>, index));
      }
    }
    return result;
  }

  set(key: IDOf<K>, item: V): this {
    if (this.get(key) === item) {
      return this;
    }
    return clone(this, {
      data: {
        ...this.data,
        [key]: item,
      },
    } as any);
  }

  merge(key: IDOf<K>, props: Partial<V>): this {
    const value = this.get(key);
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

  setAll(items: readonly Pair<IDOf<K>, V>[]): this {
    items = items.filter(([key, value]) => this.get(key) !== value);
    if (items.length === 0) {
      return this;
    }
    return clone(this, {
      data: {
        ...this.data,
        ...items.reduce((prev, now) => {
          prev[now[0]] = now[1];
          return prev;
        }, {} as Record<IDOf<K>, V>),
      },
    } as any);
  }

  mergeAll(items: readonly Pair<IDOf<K>, Partial<V>>[]): this {
    items = items.filter(([key, props]) => {
      const value = this.get(key);
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
          prev[now[0]] = clone(this.get(now[0]), now[1]);
          return prev;
        }, {} as Record<IDOf<K>, V>),
      },
    } as any);
  }

  update(key: IDOf<K>, updater: (v: V) => V): this {
    return this.set(key, updater(this.get(key)));
  }

  delete(key: IDOf<K>): this {
    if (!this.has(key)) {
      return this;
    }
    const that = clone(this, { data: { ...this.data } } as any);
    delete that.data[key];
    return that;
  }
}

export type MapKey<T> = T extends Map<infer K, infer V> ? K : never;
export type MapValue<T> = T extends Map<infer K, infer V> ? V : never;
export type MapPair<T> = T extends Map<infer K, infer V> ? Pair<K, V> : never;
