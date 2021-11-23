/*
 * @since 2020-11-04 10:51:44
 * @author acrazing <joking.young@gmail.com>
 */

import {
  addCount,
  addTwiceAsync,
  countBox,
  expectCalled,
  mergeUser,
  reset,
  selectDoubleCount,
  userBox,
  UserModel,
} from 'amos-testing';
import { selector } from './selector';
import { Store } from './store';
import { Select } from './types';
import fn = jest.fn;

describe('new Store', () => {
  it('should create store', () => {
    const store = new Store();
    expect(store.snapshot).toBeDefined();
    expect(store.dispatch).toBeDefined();
    expect(store.subscribe).toBeDefined();
    expect(store.select).toBeDefined();
    expect(store.resetInternalState).toBeDefined();
  });
});

describe('store.select', () => {
  it('should select box', () => {
    const store = new Store();
    expect(store.select(countBox)).toEqual(0);
  });
});

describe('store.preload', () => {
  it('should preload state', () => {
    const store = new Store({ count: 1 });
    expect(store.select(countBox)).toEqual(1);
  });
});

describe('store.snapshot', () => {
  it('should take snapshot', () => {
    const store = new Store({ count: 1 });
    expect(store.snapshot()).toEqual({});
    store.select(countBox);
    expect(store.snapshot()).toEqual({ count: 1 });
  });
});

describe('store.dispatch', () => {
  it('should dispatch mutation', () => {
    const store = new Store({ count: 1 });
    const r1 = store.dispatch(addCount(2));
    expect(r1).toEqual(2);
    expect(store.select(countBox)).toEqual(3);
  });

  it('should dispatch action', async () => {
    const store = new Store({ count: 1 });
    const r1 = await store.dispatch(addTwiceAsync(3));
    expect(r1).toEqual(6);
    expect(store.select(countBox)).toEqual(7);
  });

  it('should dispatch signal', () => {
    const store = new Store({ count: 1 });
    store.select(countBox);
    const r1 = store.dispatch(reset(2));
    expect(r1).toEqual({ count: 2 });
    expect(store.select(countBox)).toEqual(2);
  });

  it('should batch dispatch', async () => {
    const store = new Store({ count: 1 });
    store.select(countBox);
    const [r1, r2, r3] = await Promise.all(
      store.dispatch([reset(2), addCount(2), addTwiceAsync(2)]),
    );
    expect(r1.count).toBe(2);
    expect(r2).toEqual(2);
    expect(r3).toEqual(4);
    expect(store.select(countBox)).toEqual(8);
  });
});

describe('store.subscribe', () => {
  it('should notify listeners', async () => {
    const store = new Store();
    const fakeFn = fn();
    store.subscribe(fakeFn);
    store.dispatch(addCount(1));
    expectCalled(fakeFn);
    const r = store.dispatch([addCount(1), addCount(2), addTwiceAsync(3)]);
    expectCalled(fakeFn);
    await Promise.all(r);
    expectCalled(fakeFn);
    store.dispatch(reset(1));
    expectCalled(fakeFn);
    store.dispatch(reset(1));
    expect(fn).not.toBeCalled();
  });
});

describe('store.clearBoxes', () => {
  it('should clear boxes', () => {
    const store = new Store({
      'users/current': {
        id: 1,
        firstName: 'F1',
        lastName: 'L1',
        avatarPath: 'A1',
      } as UserModel,
    });
    store.dispatch(mergeUser({ id: 2 }));
    const fakeFn = fn();
    const u2 = store.select(userBox);
    store.resetInternalState();
    expectCalled(fakeFn);
    const u3 = store.select(userBox);
    expect(u3).toEqual(u2);
    expect(u3).not.toBe(u2);
  });
});

describe('select cache', () => {
  it('should not cache function', () => {
    const store = new Store();
    const selectUserFunction = fn((select: Select) => select(userBox));
    const selectUserDefault = selector(fn((select: Select) => select(selectUserFunction)));
    store.select(selectUserDefault).id;
    const selectUserId = selector(fn((select: Select) => select(selectUserDefault).id));
    const selectUserIdAdd = selector(
      fn((select: Select, add: number) => select(selectUserId) + add),
    );
    const selectUserIdAndDoubleCount = selector(
      fn((select: Select) => select(selectUserId) + select(selectDoubleCount)),
    );
    store.select(selectUserIdAdd(1));
    expectCalled(selectUserIdAdd.compute);
    expectCalled(selectUserDefault.compute);
    expectCalled(selectUserFunction);
    store.select(selectUserIdAdd(1));
    expectCalled(selectUserIdAdd.compute, 0);
    expectCalled(selectUserDefault.compute, 0);
    expectCalled(selectUserFunction, 0);
    store.select(selectUserIdAndDoubleCount);
    expectCalled(selectUserId.compute, 0);
    expectCalled(selectDoubleCount.compute);
  });
});
