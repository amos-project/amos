/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import { arrayEqual, clone, createBoxFactory, strictEqual } from 'amos-amos';
import { JSONState } from '../../core/src/types';
import { isJSONSerializable, shapeEqual } from '../../utils/src/utils';

export type Pair<K extends keyof any, V> = readonly [K, V];

export class Map<K extends keyof any, V> {
  readonly data: Record<K, V>;

  constructor(readonly defaultValue: V, readonly inferKey?: K) {
    this.data = {} as Record<K, V>;
  }

  static num<V>(defaultValue: V) {
    return new Map(defaultValue, 0 as number);
  }

  static str<V>(defaultValue: V) {
    return new Map(defaultValue, '' as string);
  }

  toJSON(): Record<K, V> {
    return this.data;
  }

  fromJSON(state: JSONState<Record<K, V>>): this {
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

  has(key: K): boolean {
    return this.data.hasOwnProperty(key);
  }

  get(key: K): V {
    return this.data[key] ?? this.defaultValue;
  }

  keys(): string[] {
    return Object.keys(this.data);
  }

  values(): V[] {
    return Object.values(this.data);
  }

  entities(): Pair<string, V>[] {
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

  set(key: K, item: V): this {
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

  merge(key: K, props: Partial<V>): this {
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

  setAll(items: readonly Pair<K, V>[]): this {
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
        }, {} as Record<K, V>),
      },
    } as any);
  }

  mergeAll(items: readonly Pair<K, Partial<V>>[]): this {
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
        }, {} as Record<K, V>),
      },
    } as any);
  }

  update(key: K, updater: (v: V) => V): this {
    return this.set(key, updater(this.get(key)));
  }

  delete(key: K): this {
    if (!this.data.hasOwnProperty(key)) {
      return this;
    }
    const that = clone(this, { data: { ...this.data } } as any);
    delete that.data[key];
    return that;
  }
}

export const createMapBox = createBoxFactory(Map, {
  mutations: {
    set: {},
    merge: {},
    setAll: {},
    mergeAll: {},
    update: {},
    delete: {},
  },
  selectors: {
    size: {},
    has: {},
    get: {},
    keys: { equal: arrayEqual },
    values: { equal: arrayEqual },
    entities: { equal: shapeEqual<Pair<keyof any, any>[]>([[strictEqual]]) },
    map: { equal: arrayEqual },
  },
  methods: {},
});
