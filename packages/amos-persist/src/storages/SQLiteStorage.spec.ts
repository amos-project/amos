/*
 * @since 2024-10-27 15:20:25
 * @author junbao <junbao@moego.pet>
 */

import { Database } from 'sqlite3';
import { type SQLiteDatabase, SQLiteStorage } from './SQLiteStorage';
import { promisify, testStorage } from './testUtils';

describe('SQLiteStorage', () => {
  it('should be a storage', async () => {
    const sqLiteStorage = new SQLiteStorage(
      ':memory:',
      'data',
      async (dbName: string): Promise<SQLiteDatabase> => {
        const db = new Database(dbName);
        const run = promisify(db.run.bind(db) as any);
        const all = promisify(db.all.bind(db) as any);
        return {
          runAsync: run as any,
          getAllAsync: all as any,
        };
      },
    );
    await testStorage(sqLiteStorage);
  });
});
