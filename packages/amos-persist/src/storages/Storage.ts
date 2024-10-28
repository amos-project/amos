/*
 * @since 2024-10-27 14:29:16
 * @author junbao <junbao@moego.pet>
 */
import type { PersistEntry, PersistValue } from '../types';

export interface StorageEngine {
  init?(): Promise<void>;
  getMulti(items: readonly string[]): Promise<readonly (PersistValue | null)[]>;
  getPrefix(prefix: string): Promise<readonly PersistEntry[]>;
  setMulti(items: readonly PersistEntry[]): Promise<void>;
  removeMulti(items: readonly string[]): Promise<void>;
  removePrefix(prefix: string): Promise<void>;
}
