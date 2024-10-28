/*
 * @since 2024-10-27 15:20:20
 * @author junbao <junbao@moego.pet>
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SimpleStorage } from './SimpleStorage';
import { testStorage } from './testUtils';

describe('SimpleStorage', () => {
  it('should be a storage', async () => {
    const local = new SimpleStorage(':memory:', localStorage);
    await testStorage(local);
    const _async = new SimpleStorage(':memory:', AsyncStorage);
    await testStorage(_async);
  });
});
