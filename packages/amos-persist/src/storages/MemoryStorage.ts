/*
 * @since 2024-10-17 14:15:44
 * @author junbao <junbao@moego.pet>
 */

import { PersistEntry, PersistValue, StorageEngine } from 'amos-persist';
import { nullObject } from 'amos-utils';

export class MemoryStorage implements StorageEngine {
  private readonly data = nullObject<Record<string, PersistValue>>();

  async getMulti(items: readonly string[]): Promise<readonly (PersistValue | null)[]> {
    return items.map((item) => this.data[item] || null);
  }

  async getPrefix(prefix: string): Promise<readonly PersistEntry[]> {
    return Object.keys(this.data)
      .filter((k) => k.startsWith(prefix))
      .map((k) => [k, ...this.data[k]]);
  }

  async setMulti(items: readonly PersistEntry[]): Promise<void> {
    items.forEach(([k, v, d]) => (this.data[k] = [v, d]));
  }

  async removeMulti(items: readonly string[]): Promise<void> {
    items.forEach((k) => {
      delete this.data[k];
    });
  }

  async removePrefix(prefix: string): Promise<void> {
    for (const k in this.data) {
      if (k.startsWith(prefix)) {
        delete this.data[k];
      }
    }
  }
}
