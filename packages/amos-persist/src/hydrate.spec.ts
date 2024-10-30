/*
 * @since 2024-10-17 11:48:53
 * @author junbao <junbao@moego.pet>
 */

import { createStore } from 'amos-core';
import { countBox, dispatch, Morty, Rick, sleep, userMapBox } from 'amos-testing';
import { withPersist } from './enhancer';
import { hydrate } from './state';
import { MemoryStorage } from './storages/MemoryStorage';
import { toKey } from './utils';

describe('persist actions', () => {
  it('should check middleware', async () => {
    await expect(dispatch(hydrate([]))).rejects.toThrow('persist middleware is not enabled');
  });
  it('should hydrate state', async () => {
    const engine = new MemoryStorage();
    await engine.setMulti([
      [toKey(countBox, void 0), 1, 1],
      [toKey(userMapBox, Rick.id), 1, Rick.set('firstName', 'F1')],
      [toKey(userMapBox, Morty.id), 1, Morty.set('firstName', 'F2')],
    ]);
    const store = createStore(void 0, withPersist({ storage: engine, includes: () => true }));
    const r1 = await store.dispatch(hydrate([countBox, [userMapBox, 1]]));
    expect(r1).toBeUndefined();

    expect(store.select([countBox, userMapBox])).toEqual([
      1,
      userMapBox.initialState.setItem(Rick.set('firstName', 'F1')),
    ]);
    const r2 = store.select(userMapBox.getItem(Morty.id));
    expect(r2).toBe(Morty);
    await sleep(10);
    const r3 = store.select(userMapBox.getItem(Morty.id));
    expect(r3).toEqual(Morty.set('firstName', 'F2'));
  });
});
