/*
 * @since 2022-01-06 18:50:43
 * @author junbao <junbao@moego.pet>
 */

import { threw } from './misc';
import { StorageMap } from './storage';
import { IDOf, Pair, PartialRecord, ToString } from './types';

export class OMap<V, K = string> implements StorageMap<IDOf<K>, V> {
  private data: PartialRecord<IDOf<K>, V> = {};

  constructor(items?: readonly Pair<K, V>[]) {
    items?.forEach(([key, value]) => (this.data[key as IDOf<K>] = value));
  }

  size(): number {
    let size = 0;
    for (const _k in this.data) {
      size++;
    }
    return size;
  }

  keys(): ToString<IDOf<K>>[] {
    return Object.keys(this.data) as ToString<IDOf<K>>[];
  }

  hasItem(key: IDOf<K>): boolean {
    return this.data.hasOwnProperty(key);
  }

  getItem(key: IDOf<K>): V | undefined {
    return this.data[key];
  }

  takeItem(key: IDOf<K>): V {
    threw(!this.hasItem(key), `Cannot take non-existent key ${key}.`);
    return this.data[key]!;
  }

  setItem(key: IDOf<K>, value: V): this {
    this.data[key] = value;
    return this;
  }

  mergeItem(key: IDOf<K>, value: Partial<V>): this {
    return this.setItem(key, Object.assign(this.takeItem(key), value));
  }

  removeItem(key: IDOf<K>): this {
    delete this.data[key];
    return this;
  }

  clear(): this {
    this.data = {};
    return this;
  }

  some(fn: (value: V, key: ToString<K>) => boolean): boolean {
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        if (fn(this.data[key as IDOf<K>]!, key as ToString<K>)) {
          return true;
        }
      }
    }
    return false;
  }

  every(fn: (value: V, key: ToString<K>) => boolean): boolean {
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        if (!fn(this.data[key as IDOf<K>]!, key as ToString<K>)) {
          return false;
        }
      }
    }
    return true;
  }
}
