/*
 * @since 2024-10-17 11:48:53
 * @author junbao <junbao@moego.pet>
 */

import { createStore } from 'amos-core';
import { MemoryStorage, sessionIdBox, sessionMapBox } from 'amos-testing';
import { loadBoxes } from './actions';
import { withPersist } from './enhancer';

describe('actions', () => {
  it('should load boxes', async () => {
    const storage = new MemoryStorage();
    const store = createStore({}, withPersist({ storage: storage }));
    const [sessionId, sessionMap] = await store.dispatch(loadBoxes(sessionIdBox, sessionMapBox));
    expect([
      // @ts-expect-error
      sessionId === '',
      // @ts-expect-error
      sessionMap === 0,
    ]).toEqual([false, false]);
  });
});
