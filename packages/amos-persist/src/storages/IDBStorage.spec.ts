/*
 * @since 2024-10-27 15:20:09
 * @author junbao <junbao@moego.pet>
 */

import { IDBStorage } from './IDBStorage';
import { testStorage } from './testUtils';

describe('SimpleStorage', () => {
  it('should be a storage', async () => {
    const idb = new IDBStorage(':memory:', 'data');
    await testStorage(idb);
  });
});
