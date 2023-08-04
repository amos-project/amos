/*
 * @since 2021-07-18 15:12:36
 * @author junbao <junbao@mymoement.com>
 */

import { Box } from 'amos-core';
import { JSONState, StorageEngine } from 'amos-utils';

export interface PersistedState<T> {
  v: number;
  s: T;
}

export interface BoxPersistOptions<S> {
  version: number;
  migrations?: {
    from: number;
    to: number;
    handler: (jsonState: any) => JSONState<S>;
  }[];
}

declare module 'amos-core' {
  export interface BoxOptions<S> {
    persist?: BoxPersistOptions<S>;
  }
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
