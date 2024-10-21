/*
 * @since 2024-10-18 00:33:43
 * @author junbao <junbao@moego.pet>
 */

import { ValueOrPromise } from 'amos-utils';
import { PersistSpan, PersistValue, StorageEngine } from '../types';

// compat with Web Storage and React Native AsyncStorage
export interface Storage {
  length?: number;
  getItem(key: string): ValueOrPromise<string | null>;
  setItem(key: string, value: string): ValueOrPromise<void>;
  removeItem(key: string): ValueOrPromise<void>;
  key?(index: number): string | null;
  getAllKeys?(): ValueOrPromise<readonly string[]>;
}

export class SimpleStorage implements StorageEngine {
  constructor(
    readonly prefix: string,
    readonly storage: Storage,
    readonly delimiter: string = ':',
  ) {}

  async getMulti(items: readonly string[]): Promise<readonly (PersistValue | null)[]> {
    return Promise.all(items.map((key) => this.getItem(this.genKey(key))));
  }

  async getPrefix(prefix: string): Promise<readonly PersistSpan[]> {
    const keys = await this.allKeys(prefix);
    const r = await Promise.all(keys.map((k) => this.getItem(k)));
    return keys.map((k, i) => [k, ...(r[i] || [])] as const).filter((v) => v.length === 3);
  }

  async setMulti(items: readonly PersistSpan[]): Promise<void> {
    for (const [key, version, value] of items) {
      this.storage.setItem(this.genKey(key), JSON.stringify([version, value]));
    }
  }

  async removeMulti(items: readonly string[]): Promise<void> {
    await Promise.all(items.map((key) => this.storage.removeItem(this.genKey(key))));
  }

  async removePrefix(prefix: string): Promise<void> {
    const keys = await this.allKeys(this.genKey(prefix));
    await Promise.all(keys.map((k) => this.storage.removeItem(k)));
  }

  private async getItem(key: string): Promise<PersistValue | null> {
    const v = await this.storage.getItem(this.genKey(key));
    if (!v) {
      return null;
    }
    return JSON.parse(v);
  }

  private async allKeys(prefix: string) {
    const keyPrefix = this.genKey(prefix);
    const headSize = this.genKey('').length;
    if (this.storage.getAllKeys) {
      const keys = await this.storage.getAllKeys();
      return keys.filter((k) => k.startsWith(keyPrefix)).map((k) => k.substring(headSize));
    } else if (this.storage.length && this.storage.key) {
      const keys: string[] = [];
      for (let i = 0, size = this.storage.length; i < size; i++) {
        const key = this.storage.key(i);
        if (key?.startsWith(keyPrefix)) {
          keys.push(key!.substring(headSize));
        }
      }
      return keys;
    }
    return [];
  }

  private genKey(key: string) {
    return `${this.prefix}${this.delimiter}${key}`;
  }
}
