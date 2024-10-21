/*
 * @since 2021-07-18 15:12:36
 * @author junbao <junbao@mymoement.com>
 */

import { ActionFactory, Box } from 'amos-core';
import { ID } from 'amos-utils';

export interface BoxPersistOptions<S> {
  /**
   * The data structure version of the box, if the current version
   * is not equal to the persisted version, will call {@link migrate}
   * to migrate it to the current version.
   */
  version: number;

  /**
   * Migration function, should be an `ActionFactory`, which allows
   * you to use existing state or run some actions.
   */
  migrate?: ActionFactory<[version: number, row: ID, state: unknown], S | undefined>;
}

export type PersistValue = readonly [version: number, value: any];
export type PersistSpan = readonly [key: string, ...PersistValue];

export interface PersistRow {
  key: string;
  version: number;
  value: any;
}

export interface StorageEngine {
  init?(): Promise<void>;
  getMulti(items: readonly string[]): Promise<readonly (PersistValue | null)[]>;
  getPrefix(prefix: string): Promise<readonly PersistSpan[]>;
  setMulti(items: readonly PersistSpan[]): Promise<void>;
  removeMulti(items: readonly string[]): Promise<void>;
  removePrefix(prefix: string): Promise<void>;
}

export interface PersistOptions {
  /**
   * The storage engine of the persist, supports localStorage/sessionStorage/indexedDB
   * in browser, and AsyncStorage/SQLite in react-native.
   */
  storage: StorageEngine;

  /**
   * determine the box should be persisted/hydrated or not.
   */
  includes?: (box: Box) => boolean;

  /**
   * determine the box should be persisted/hydrated or not.
   *
   * Please note the `excludes` has priority over `includes`.
   */
  excludes?: (box: Box) => boolean;

  /**
   * error handling
   */
  onError: (error: unknown) => void;
}
