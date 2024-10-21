/*
 * @since 2024-10-18 00:33:43
 * @author junbao <junbao@moego.pet>
 */

import { PersistRow, PersistSpan, PersistValue, StorageEngine } from 'amos-persist';

export class IDBStorage implements StorageEngine {
  private db!: IDBDatabase;

  constructor(
    readonly database: string,
    readonly table: string,
  ) {}

  init() {
    return new Promise<void>((resolve, reject) => {
      const req = indexedDB.open(this.database, 1);
      req.onerror = reject;
      req.onupgradeneeded = () => {
        req.result.onerror = reject;
        req.result.createObjectStore(this.table, {
          keyPath: 'key',
        });
      };
      req.onsuccess = () => {
        this.db = req.result;
        resolve();
      };
    });
  }

  getMulti(items: readonly string[]): Promise<readonly (PersistValue | null)[]> {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction([this.table], 'readonly');
      transaction.onerror = reject;
      let objectStore = transaction.objectStore(this.table);
      Promise.all(
        items.map((item) => {
          return new Promise<PersistValue | null>((resolve, reject) => {
            let request: IDBRequest<PersistRow | null> = objectStore.get(item);
            request.onerror = reject;
            request.onsuccess = () =>
              resolve(request.result ? [request.result.version, request.result.value] : null);
          });
        }),
      ).then(resolve, reject);
    });
  }

  getPrefix(prefix: string): Promise<readonly PersistSpan[]> {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction([this.table], 'readwrite');
      transaction.onerror = reject;
      const os = transaction.objectStore(this.table);
      const req: IDBRequest<PersistRow[]> = os.getAll(
        IDBKeyRange.bound(prefix, prefix + '\uFFFF', false, true),
      );
      req.onsuccess = () => resolve(req.result.map((r) => [r.key, r.version, r.value]));
      req.onerror = reject;
    });
  }

  setMulti(items: readonly PersistSpan[]): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      let transaction = this.db.transaction([this.table], 'readwrite');
      transaction.oncomplete = resolve;
      transaction.onerror = reject;
      let objectStore = transaction.objectStore(this.table);
      items.forEach(([key, version, value]) => {
        const request = objectStore.put({ key, version, value } satisfies PersistRow);
        request.onerror = reject;
      });
    });
  }

  removeMulti(items: readonly string[]): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      let transaction = this.db.transaction([this.table], 'readwrite');
      transaction.oncomplete = resolve;
      transaction.onerror = reject;
      let objectStore = transaction.objectStore(this.table);
      items.forEach((item) => {
        const request = objectStore.delete(item);
        request.onerror = reject;
      });
    });
  }

  removePrefix(prefix: string): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      let transaction = this.db.transaction([this.table], 'readwrite');
      transaction.oncomplete = resolve;
      transaction.onerror = reject;
      const os = transaction.objectStore(this.table);
      const req = os.delete(IDBKeyRange.bound(prefix, prefix + '\uFFFF', false, true));
      req.onerror = reject;
    });
  }
}
