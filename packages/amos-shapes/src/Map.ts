/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import {
  type ArraySource,
  clone,
  Constructor,
  Entry,
  fromJS,
  FuncParams,
  FuncReturn,
  ID,
  isArray,
  isIterable,
  JSONSerializable,
  JSONState,
  nullObject,
  PartialDictionary,
  PartialRecord,
  toArray,
  ToString,
  WellPartial,
} from 'amos-utils';

export class Map<K extends ID, V> implements JSONSerializable<Record<K, V>> {
  protected readonly data: Readonly<Record<K, V>> = nullObject();

  constructor(readonly defaultValue: V) {}

  toJSON(): Record<K, V> {
    return this.data;
  }

  fromJS(state: JSONState<Record<K, V>>): this {
    const data: any = nullObject<Record<K, V>>();
    for (const k in state) {
      data[k] = fromJS(this.defaultValue, state[k]);
    }
    return this.reset(data);
  }

  size() {
    return Object.keys(this.data).length;
  }

  hasItem(key: K): boolean {
    return key in this.data;
  }

  getItem(key: K): V {
    return this.hasItem(key) ? this.data[key] : this.defaultValue;
  }

  reset(data: PartialRecord<K, V>): this {
    return clone(this, { data } as any);
  }

  setItem(key: K, item: V): this {
    if (this.getItem(key) === item) {
      return this;
    }
    return this.reset(nullObject(this.data, { [key]: item } as any));
  }

  setAll(items: PartialDictionary<K, V> | ArraySource<Entry<K, V>>): this {
    const up: PartialRecord<K, V> = {};
    let dirty = false;
    if (Array.isArray(items) || isIterable(items)) {
      for (const [k, v] of items) {
        if (v !== this.getItem(k)) {
          dirty ||= true;
          up[k as K] = v;
        }
      }
    } else {
      for (const k in items) {
        if ((items as PartialRecord<K, V>)[k as K] !== this.getItem(k as K)) {
          dirty ||= true;
          up[k as K] = (items as PartialRecord<K, V>)[k as K];
        }
      }
    }
    if (!dirty) {
      return this;
    }
    return this.reset(nullObject(this.data, up) as any);
  }

  // only allowed for non-array object item
  /**
   * Merge properties to the existing or default value.
   *
   * Note: only allowed for non-array object item.
   * Note: built-in objects like Date/Map cannot be merged.
   */
  mergeItem(key: K, props: WellPartial<V>): this {
    return this.setItem(key, clone(this.getItem(key), props));
  }

  /**
   * Merge properties for multiple targets.
   *
   * @see mergeItem
   */
  mergeAll(
    items: PartialDictionary<K, WellPartial<V>> | ArraySource<Entry<K, WellPartial<V>>>,
  ): this {
    const data = isArray(items)
      ? items
      : isIterable(items)
        ? Array.from(items)
        : Object.entries(items);
    return this.setAll(data.map(([k, v]) => [k, clone(this.getItem(k), v)]));
  }

  updateItem(key: K, updater: (v: V) => V): this {
    return this.setItem(key, updater(this.getItem(key)));
  }

  updateAll(updater: (v: V, key: ToString<K>) => V): this {
    const up: PartialRecord<K, V> = {};
    for (const k in this.data) {
      const v = updater(this.getItem(k), k);
      if (v !== this.getItem(k)) {
        up[k as K] = v;
      }
    }
    return this.reset(nullObject(this.data, up) as any);
  }

  removeItem(key: K): this {
    return this.removeAll([key]);
  }

  removeAll(keys: Iterable<K> | readonly K[]) {
    const keysArr = toArray(keys).filter((k) => this.hasItem(k));
    if (!keysArr.length) {
      return this;
    }
    const data = nullObject(this.data);
    for (const k of keysArr) {
      delete data[k];
    }
    return this.reset(data);
  }

  clear(): this {
    if (this.size() === 0) {
      return this;
    }
    return this.reset({});
  }

  forEach(callbackFn: (value: V, key: ToString<K>, index: number) => void) {
    let i = 0;
    for (const key in this.data) {
      callbackFn(this.data[key]!, key, i++);
    }
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  *entries(): IterableIterator<[K, V]> {
    for (const k in this.data) {
      yield [k, this.data[k]!];
    }
  }

  *keys(): IterableIterator<K> {
    for (const k in this.data) {
      yield k;
    }
  }

  *values(): IterableIterator<V> {
    for (const k in this.data) {
      yield this.data[k]!;
    }
  }
}

export type MapKey<T> = T extends Map<any, any> ? Parameters<T['getItem']>[0] : never;
export type MapValue<T> = T extends Map<any, any> ? ReturnType<T['getItem']> : never;
export type MapEntry<T> = T extends Map<infer K, infer V> ? Entry<K, V> : never;

export type MapDelegateOperations<
  K extends ID,
  V,
  M extends keyof V,
  G extends keyof V,
  KLimiter = V,
> = {
  [P in keyof KLimiter & M as `${P & string}In`]: <TThis>(
    this: TThis,
    key: K,
    ...args: FuncParams<V[P]>
  ) => TThis;
} & {
  [P in keyof KLimiter & G as `${P & string}In`]: (
    key: K,
    ...args: FuncParams<V[P]>
  ) => FuncReturn<V[P]>;
};

export function implementMapDelegations<T, PT = {}>(
  ctor: Constructor<T, any[]>,
  mutations: {
    [P in keyof T as P extends keyof PT ? never : P extends `${infer F}In` ? F : never]:
      | 'get'
      | 'set';
  },
  p?: Constructor<PT, any[]>,
) {
  for (const k in mutations) {
    Object.defineProperty(ctor.prototype, (k as string) + 'In', {
      value:
        mutations[k] === 'set'
          ? function (this: Map<any, any>, key: any, ...args: any[]) {
              return this.setItem(key, this.getItem(key)[k](...args));
            }
          : function (this: Map<any, any>, key: any, ...args: any[]) {
              return this.getItem(key)[k](...args);
            },
    });
  }
}
