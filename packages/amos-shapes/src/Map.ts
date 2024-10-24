/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import {
  clone,
  Constructor,
  Entry,
  fromJS,
  FuncParams,
  ID,
  isArray,
  JSONSerializable,
  JSONState,
  nullObject,
  PartialRecord,
  toArray,
  ToString,
  WellPartial,
} from 'amos-utils';

export class Map<K extends ID, V> implements JSONSerializable<Record<K, V>> {
  protected readonly data: Record<K, V> = nullObject();

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

  setAll(items: PartialRecord<K, V> | ReadonlyArray<Entry<K, V>>): this {
    const up: PartialRecord<K, V> = {};
    let dirty = false;
    if (Array.isArray(items)) {
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
    return this.reset(nullObject(this.data, items) as any);
  }

  // only allowed for non-array object item
  mergeItem(key: K, props: WellPartial<V>): this {
    return this.setItem(key, clone(this.getItem(key), props));
  }

  mergeAll(
    items: PartialRecord<K, WellPartial<V>> | ReadonlyArray<Entry<K, WellPartial<V>>>,
  ): this {
    const data = isArray(items) ? items : Object.entries(items);
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

export type DelegateMapValueMutations<K extends ID, V, M extends keyof V, KLimiter = V> = {
  [P in keyof KLimiter & M as `${P & string}In`]: <TThis>(
    this: TThis,
    key: K,
    ...args: FuncParams<V[P]>
  ) => TThis;
} & {
  delegateMapValueMutations: Record<M, null>;
};

export function implementMapDelegations<K extends ID, V, M extends keyof V, S extends string>(
  ctor: Constructor<DelegateMapValueMutations<K, V, M, S>, any[]>,
  mutations: Record<M, null>,
) {
  ctor.prototype.delegateMapValueMutations = mutations;
  for (const k in mutations) {
    ctor.prototype[k + 'In'] = function (key: any, ...args: any[]) {
      return this.setItem(key, this.getItem(key)[k](...args));
    };
  }
}
