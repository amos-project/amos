/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import {
  clone,
  Constructor,
  fromJS,
  FuncParams,
  ID,
  JSONSerializable,
  JSONState,
  MustNever,
  nullObject,
  Pair,
  PartialRecord,
  shallowContainEqual,
  ToString,
  WellPartial,
} from 'amos-utils';

export class Map<K extends ID, V> implements JSONSerializable<PartialRecord<K, V>> {
  protected readonly data: PartialRecord<K, V> = nullObject();

  constructor(readonly defaultValue: V) {}

  toJSON(): PartialRecord<K, V> {
    return this.data;
  }

  fromJS(state: JSONState<PartialRecord<K, V>>): this {
    const data: any = nullObject<Record<K, V>>();
    for (const k in state) {
      data[k] = fromJS(this.defaultValue, state[k]);
    }
    return this.reset(data);
  }

  size() {
    return Object.keys(this.data).length;
  }

  has(key: K): boolean {
    return key in this.data;
  }

  get(key: K): V | undefined {
    return this.data[key];
  }

  getOrDefault(key: K): V {
    return this.has(key) ? this.get(key)! : this.defaultValue;
  }

  set(key: K, item: V): this {
    if (this.get(key) === item) {
      return this;
    }
    return this.reset(nullObject(this.data, { [key]: item } as any));
  }

  setAll(items: PartialRecord<K, V>): this;
  setAll(items: readonly Pair<K, V>[]): this;
  setAll(items: readonly Pair<K, V>[] | PartialRecord<K, V>): this {
    const data = Array.isArray(items) ? items : Object.entries(items);
    const up = data.filter(([k, v]) => v !== this.get(k));
    if (up.length === 0) {
      return this;
    }
    return this.reset(nullObject(this.data, items) as any);
  }

  mergeItem(key: K, props: WellPartial<V>): this {
    const old = this.getOrDefault(key);
    if (shallowContainEqual(old, props)) {
      return this;
    }
    return this.set(key, clone(old, props));
  }

  merge(items: readonly Pair<K, WellPartial<V>>[]): this;
  merge(items: PartialRecord<K, WellPartial<V>>): this;
  merge(items: readonly Pair<K, WellPartial<V>>[] | PartialRecord<K, WellPartial<V>>): this {
    const input = Array.isArray(items) ? items : Object.entries(items);
    const up = input.filter(([k, v]) => shallowContainEqual(this.getOrDefault(k), v));
    if (up.length === 0) {
      return this;
    }

    const data: any = nullObject(this.data);
    for (const [key, props] of up) {
      data[key] = clone(this.getOrDefault(key), props);
    }
    return this.reset(data);
  }

  updateItem(key: K, updater: (v: V) => V): this {
    return this.set(key, updater(this.getOrDefault(key)));
  }

  delete(key: K): this {
    if (!this.has(key)) {
      return this;
    }
    const data = nullObject(this.data);
    delete data[key];
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

  map<U>(callbackFn: (value: V, key: ToString<K>, index: number) => U): U[] {
    const result: U[] = [];
    let index = 0;
    for (const key in this.data) {
      result.push(callbackFn(this.data[key]!, key as ToString<K>, index++));
    }
    return result;
  }

  searchUpdateOnce(callbackFn: (value: V, key: ToString<K>) => V): this {
    for (const key in this.data) {
      const value = callbackFn(this.data[key as K]!, key as ToString<K>);
      if (value !== this.data[key as K]) {
        return this.reset({ ...this.data, [key]: value });
      }
    }
    return this;
  }

  reset(data: PartialRecord<K, V>): this {
    return clone(this, { data } as any);
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  /**
   * Returns an iterable of key, value pairs for every entry in the map.
   */
  *entries(): IterableIterator<[K, V]> {
    for (const k in this.data) {
      yield [k, this.data[k]!];
    }
  }

  /**
   * Returns an iterable of keys in the map
   */
  *keys(): IterableIterator<K> {
    for (const k in this.data) {
      yield k;
    }
  }

  /**
   * Returns an iterable of values in the map
   */
  *values(): IterableIterator<V> {
    for (const k in this.data) {
      yield this.data[k]!;
    }
  }
}

declare type MissedKeys = Exclude<
  keyof globalThis.Map<any, any>,
  (typeof Symbol)['toStringTag'] | keyof Map<any, any>
>;
declare type CheckMissedKeys = MustNever<MissedKeys>;

export type MapKey<T> = T extends Map<any, any> ? Parameters<T['get']>[0] : never;
export type MapValue<T> = T extends Map<any, any> ? T['defaultValue'] : never;
export type MapPair<T> = T extends Map<infer K, infer V> ? Pair<K, V> : never;

export type DelegateMapValueMutations<K extends ID, V, M extends keyof V, KLimiter = V> = {
  [P in keyof KLimiter & M as `${P & string}At`]: <TThis>(
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
    ctor.prototype[k + 'At'] = function (key: any, ...args: any[]) {
      return this.setItem(key, this.getItem(key)[k](...args));
    };
  }
}
