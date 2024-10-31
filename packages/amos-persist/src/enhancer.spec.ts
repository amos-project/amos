/*
 * @since 2024-10-17 11:48:53
 * @author junbao <junbao@moego.pet>
 */

import { createStore } from 'amos-core';
import {
  countBox,
  darkModeBox,
  dispatch,
  expectCalledWith,
  Jerry,
  Morty,
  postMapBox,
  Rick,
  sessionMapBox,
  sleep,
  userMapBox,
} from 'amos-testing';
import { append } from 'amos-utils';
import { withPersist } from './enhancer';
import { hydrate } from './state';
import { MemoryStorage } from './storages/MemoryStorage';
import { toKey } from './utils';

describe('withPersist', () => {
  it('should check middleware', async () => {
    await expect(dispatch(hydrate([]))).rejects.toThrow('persist middleware is not enabled');
  });
  it('should hydrate state', async () => {
    const engine = new MemoryStorage();
    await engine.setMulti([
      [toKey(countBox), 1, 1],
      [toKey(darkModeBox), 1, 3],
      [toKey(userMapBox, Rick.id), 1, Rick.set('firstName', 'F1')],
      [toKey(userMapBox, Morty.id), 1, Morty.set('firstName', 'F2')],
    ]);
    const setMulti = jest.fn();
    const getMulti = jest.fn();
    const getPrefix = jest.fn();
    const removePrefix = jest.fn();
    const removeMulti = jest.fn();
    append(engine, 'getPrefix', getPrefix);
    append(engine, 'getMulti', getMulti);
    append(engine, 'setMulti', setMulti);
    append(engine, 'removePrefix', removePrefix);
    append(engine, 'removeMulti', removeMulti);

    const store = createStore(void 0, withPersist({ storage: engine, includes: () => true }));
    const r1 = await store.dispatch(
      hydrate([countBox, [userMapBox, Rick.id], [sessionMapBox, [1, 2]]]),
    );
    expect(r1).toBeUndefined();
    expectCalledWith(getMulti, [
      [
        toKey(countBox),
        toKey(userMapBox, Rick.id),
        toKey(sessionMapBox, 1),
        toKey(sessionMapBox, 2),
      ],
    ]);

    expect(store.select([countBox, userMapBox])).toEqual([
      1,
      userMapBox.getInitialState().setItem(Rick.set('firstName', 'F1')),
    ]);
    const r2 = store.select(userMapBox.getItem(Morty.id));
    expect(r2).toBe(Morty);
    await sleep(1);
    const r3 = store.select(userMapBox.getItem(Morty.id));
    expect(r3).toEqual(Morty.set('firstName', 'F2'));
    expectCalledWith(getMulti, [[toKey(userMapBox, Morty.id)]]);

    expect(await engine.getPrefix(toKey(userMapBox))).toEqual([
      [toKey(userMapBox, Rick.id), 1, Rick.set('firstName', 'F1')],
      [toKey(userMapBox, Morty.id), 1, Morty.set('firstName', 'F2')],
    ]);
    expectCalledWith(getPrefix, [toKey(userMapBox)]);

    store.dispatch(userMapBox.mergeIn(Jerry.id, { firstName: 'F3' }));
    await sleep(1);
    expect(await engine.getPrefix(toKey(userMapBox))).toEqual([
      [toKey(userMapBox, Rick.id), 1, Rick.set('firstName', 'F1')],
      [toKey(userMapBox, Morty.id), 1, Morty.set('firstName', 'F2')],
      [toKey(userMapBox, Jerry.id), 1, Jerry.set('firstName', 'F3')],
    ]);
    expectCalledWith(getPrefix, [toKey(userMapBox)]);

    store.dispatch(userMapBox.removeItem(Rick.id));
    await sleep(1);
    expectCalledWith(removeMulti, [[toKey(userMapBox, Rick.id)]]);
    store.dispatch(userMapBox.clear());
    await sleep(1);
    expectCalledWith(removePrefix, [toKey(userMapBox)]);
    await store.dispatch(hydrate([sessionMapBox]));
    expectCalledWith(getPrefix, [toKey(sessionMapBox)]);
    store.select(postMapBox.getItem(1));
    await sleep(1);
    expectCalledWith(getMulti, [[toKey(postMapBox, 1)]]);

    const r4 = store.select(darkModeBox);
    await sleep(1);
    const r5 = store.select(darkModeBox);
    expect([r4, r5]).toEqual([false, 3 * 2 + 1]);
  });
});
