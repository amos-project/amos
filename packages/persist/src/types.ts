/*
 * @since 2021-07-18 15:12:36
 * @author junbao <junbao@mymoement.com>
 */

import { Box } from 'amos';

declare module 'amos' {
  export interface BoxOptions<S> {
    persistVersion?: number;
  }
}

/**
 * The storage engine, supports Storage in web and AsyncStorage in React Native.
 */
export interface StorageEngine {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  mergeItem?(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

export interface PersistOptions {
  /**
   * The key of the state persisted in the engine
   */
  key: string;

  /**
   * The engine of the persist, supports localStorage/sessionStorage
   * in browser, and AsyncStorage in react-native.
   */
  engine: StorageEngine;

  /**
   * determine the box should be persisted/hydrated or not.
   */
  includes?: Array<Box | string>;

  /**
   * determine the box should be persisted/hydrated or not.
   *
   * Please note the `excludes` has priority over `includes`.
   */
  excludes?: Array<Box | string>;
}

export interface PersistedState<T> {
  v: number;
  s: T;
}
