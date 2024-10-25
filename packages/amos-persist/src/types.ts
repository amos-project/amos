/*
 * @since 2021-07-18 15:12:36
 * @author junbao <junbao@mymoement.com>
 */

import { ActionFactory, Actor, Box } from 'amos-core';
import { ID } from 'amos-utils';

export interface BoxPersistOptions<S> {
  /**
   * The data structure version of the box, if the current version
   * is not equal to the persisted version, will call {@link migrate}
   * to migrate it to the current version.
   */
  version: number;

  /**
   * Migration function, which can be a {@link Actor} or {@link ActionFactory}
   * to allow you use existing state or run some actions.
   */
  migrate?:
    | Actor<[version: number, row: ID, state: unknown], S | undefined>
    | ActionFactory<[version: number, row: ID, state: unknown], S | undefined>;
}

export type PersistValue = readonly [version: number, value: any];
export type PersistEntry = readonly [key: string, ...PersistValue];

export interface PersistModel {
  key: string;
  version: number;
  value: any;
}

export interface StorageEngine {
  init?(): Promise<void>;
  getMulti(items: readonly string[]): Promise<readonly (PersistValue | null)[]>;
  getPrefix(prefix: string): Promise<readonly PersistEntry[]>;
  setMulti(items: readonly PersistEntry[]): Promise<void>;
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
   * If not set, will determine by a box's {@link BoxOptions.persist} option.
   */
  includes?: (box: Box) => boolean;

  /**
   * Determine the box should be persisted/hydrated or not.
   *
   * If not set, will determine by a box's {@link BoxOptions.persist} option.
   *
   * Please note the `excludes` has priority over `includes`.
   */
  excludes?: (box: Box) => boolean;

  /**
   * error handling
   */
  onError: (error: unknown) => void;
}
