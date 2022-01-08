/*
 * @since 2022-01-08 10:32:44
 * @author junbao <junbao@moego.pet>
 */

import { ID, ToString } from './types';

/**
 * The map api based on the storage api rather than map.
 */
export interface StorageMap<K extends ID, V> {
  size(): number;
  keys(): ToString<K>[];

  hasItem(key: K): boolean;
  getItem(key: K): V | undefined;

  setItem(key: K, value: V): this;
  mergeItem(key: K, value: Partial<V>): this;

  removeItem(key: K): this;
  clear(): this;
}

/**
 * The storage engine, supports Storage in web and AsyncStorage in React Native
 * and {@link StorageMap}.
 */
export interface StorageEngine {
  getItem(key: string): string | null | Promise<string | null> | undefined;
  setItem(key: string, value: string): void | Promise<void> | this;
  removeItem(key: string): void | Promise<void> | this;

  mergeItem?(key: string, value: string): void | Promise<void> | this;
  clear?(): void | Promise<void> | this;
}
