/*
 * @since 2024-10-17 11:48:53
 * @author junbao <junbao@moego.pet>
 */

import { createStore } from 'amos-core';
import { countBox, Morty, Rick, userMapBox } from 'amos-testing';
import { hydrateState } from './actions';
import { withPersist } from './enhancer';
import { MemoryStorage } from './storages/MemoryStorage';

describe('persist actions', () => {
  it('should hydrate state', async () => {
    const engine = new MemoryStorage();
    await engine.setMulti([
      [countBox.key + ':', 1, 1],
      [userMapBox.key + ':' + Rick.id, 1, Rick.set('firstName', 'F1')],
      [userMapBox.key + ':' + Morty.id, 1, Morty.set('firstName', 'F2')],
    ]);
    const store = createStore(void 0, withPersist({ storage: engine, includes: () => true }));
    await store.dispatch(hydrateState(countBox, [userMapBox, 1]));
  });
});
