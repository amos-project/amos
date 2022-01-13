/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import {
  clone,
  Ctor,
  FnParams,
  ID,
  isJSONSerializable,
  JSONSerializable,
  JSONState,
  Pair,
  PartialRecord,
  propsEqual,
  StorageMap,
  ToString,
  WellPartial,
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
    const data: PartialRecord<K, V> = {};
    if (isJSONSerializable(this.defaultValue)) {
      for (const key in state) {
        data[key as unknown as K] = this.defaultValue.fromJSON(state[key]);
      }
    } else {
      for (const key in state) {
        data[key as unknown as K] = clone(this.defaultValue, state[key] as any);
      }
    }
    return this.reset(data);
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
    return this.reset({ ...this.data, [key]: item });
  }

  setAll(items: readonly Pair<K, V>[]): this {
    items = items.filter(([key, value]) => this.getItem(key) !== value);
    if (items.length === 0) {
      return this;
    }
    const data = { ...this.data };
    for (const [key, value] of items) {
      data[key] = value;
    }
    return this.reset(data);
  }

  mergeItem(key: K, props: WellPartial<V>): this {
    const value = this.getItem(key);
    if (propsEqual<any>(value, props)) {
      return this;
    }
    return this.setItem(key, clone(value, props));
  }

  mergeAll(items: readonly Pair<K, WellPartial<V>>[]): this {
    items = items.filter(([key, props]) => !propsEqual(this.getItem(key), props));
    if (items.length === 0) {
      return this;
    }

    const data = { ...this.data };
    for (const [key, props] of items) {
      data[key] = clone(this.getItem(key), props);
    }
    return this.reset(data);
  }

  updateItem(key: K, updater: (v: V) => V): this {
    return this.setItem(key, updater(this.getItem(key)));
  }

  removeItem(key: K): this {
    if (!this.hasItem(key)) {
      return this;
    }
    const data = { ...this.data };
    delete data[key];
    return this.reset(data);
  }

  clear(): this {
    return this.reset({});
  }

  map<U>(callbackFn: (value: V, key: ToString<K>, index: number) => U): U[] {
    const result: U[] = [];
    let index = 0;
    for (const key in this.data) {
      result.push(callbackFn(this.data[key as K]!, key as ToString<K>, index++));
    }
    return result;
  }

  reset(data: PartialRecord<K, V>): this {
    return clone(this, { data } as WellPartial<this>);
  }
}

export type MapKey<T> = T extends Map<infer K, infer V> ? K : never;
export type MapValue<T> = T extends Map<infer K, infer V> ? V : never;
export type MapPair<T> = T extends Map<infer K, infer V> ? Pair<K, V> : never;

export type DelegateMapValueMutations<K extends ID, V, M extends keyof V, S extends string> = {
  [P in M as `${P & string}${S}`]: <TThis>(this: TThis, key: K, ...args: FnParams<V[P]>) => TThis;
} & {
  delegateMapValueMutations: { suffix: S; methods: Record<M, null> };
};

export function implementMapDelegations<K extends ID, V, M extends keyof V, S extends string>(
  ctor: Ctor<DelegateMapValueMutations<K, V, M, S>, any[]>,
  mutations: Record<M, null>,
  mutationSuffix: S,
) {
  ctor.prototype.delegateMapValueMutations = { suffix: mutationSuffix, methods: mutations };
  for (const k in mutations) {
    ctor.prototype[k + mutationSuffix] = function (key: any, ...args: any[]) {
      return this.setItem(key, this.getItem(key)[k](...args));
    };
  }
}
