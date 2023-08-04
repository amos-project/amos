/*
 * @since 2022-01-06 18:51:01
 * @author junbao <junbao@moego.pet>
 */

import { StorageMap } from './storage';
import { ID, PartialRecord, ToString } from './types';

export class OSet<T extends ID = string> implements StorageMap<T, T> {
  private data: PartialRecord<T, true> = {};

  constructor(values: readonly T[] = []) {
    values.forEach((v) => (this.data[v] = true));
  }

  size(): number {
    return Object.keys(this.data).length;
  }

  keys(): ToString<T>[] {
    return Object.keys(this.data) as ToString<T>[];
  }

  hasItem(value: T): boolean {
    return this.data.hasOwnProperty(value);
  }

  getItem(key: T): T | undefined {
    return this.hasItem(key) ? key : void 0;
  }

  setItem(value: T): this {
    this.data[value] = true;
    return this;
  }

  mergeItem(key: T): this {
    throw new Error('The operation is not supported');
  }

  removeItem(value: T): this {
    delete this.data[value];
    return this;
  }

  clear(): this {
    this.data = {};
    return this;
  }

  forEach(fn: (value: ToString<T>) => void) {
    for (const value in this.data) {
      if (this.data.hasOwnProperty(value)) {
        fn(value);
      }
    }
  }

  some(fn: (value: ToString<T>) => boolean): boolean {
    for (const value in this.data) {
      if (this.data.hasOwnProperty(value)) {
        if (fn(value)) {
          return true;
        }
      }
    }
    return false;
  }

  every(fn: (value: ToString<T>) => boolean): boolean {
    for (const value in this.data) {
      if (this.data.hasOwnProperty(value)) {
        if (!fn(value)) {
          return false;
        }
      }
    }
    return true;
  }
}
