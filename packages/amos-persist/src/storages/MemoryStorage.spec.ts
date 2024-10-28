/*
 * @since 2024-10-27 15:20:13
 * @author junbao <junbao@moego.pet>
 */

import { MemoryStorage } from './MemoryStorage';
import { testStorage } from './testUtils';

describe('SimpleStorage', () => {
  it('should be a storage', async () => {
    const memory = new MemoryStorage();
    await testStorage(memory);
  });
});
