/*
 * @since 2021-07-18 15:12:36
 * @author junbao <junbao@mymoement.com>
 */

import { ActionFactory, Actor, Box } from 'amos-core';
import { ID } from 'amos-utils';
import type { StorageEngine } from './storages/Storage';

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
   *
   * Note: The migrate function should convert the persisted value to the state
   * that can be merged by the state's {@link FromJS.fromJS}, not to the state
   * directly.
   */
  migrate?:
    | Actor<[version: number, row: ID, state: unknown], unknown | undefined>
    | ActionFactory<[version: number, row: ID, state: unknown], unknown | undefined>;
}

export type PersistKey<T> = Box<T> | [box: Box<T>, rows: ID | ID[]];
export type PersistKeyState<T> = T extends PersistKey<infer S> ? S : never;
export type MapPersistKeys<K extends readonly PersistKey<any>[]> = {
  [P in keyof K]: PersistKeyState<K[P]>;
};
export type PersistValue = readonly [version: number, value: any];
export type PersistEntry = readonly [key: string, version: number, value: any];

export interface PersistModel {
  key: string;
  version: number;
  value: any;
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
