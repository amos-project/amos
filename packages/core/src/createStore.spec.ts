/*
 * @since 2020-11-04 10:51:44
 * @author acrazing <joking.young@gmail.com>
 */

import fn = jest.fn;
import { countBox, expectCalled, logout } from 'amos-testing';
import { createStore } from './createStore';
import { selector } from './selector';
import { Select } from './types';

describe('new Store', () => {
  it('should create store', () => {
    const store = createStore();
    expect(Object.keys(store).sort()).toEqual(
      ['snapshot', 'dispatch', 'subscribe', 'select'].sort(),
    );
  });
});

describe('store.select', () => {
  it('should select box', () => {
    const store = createStore();
    expect(store.select(countBox)).toEqual(0);
  });
});

describe('store.preload', () => {
  it('should preload state', () => {
    const store = createStore({ preloadedState: { count: 1 } });
    expect(store.select(countBox)).toEqual(1);
  });
});

describe('store.snapshot', () => {
  it('should take snapshot', () => {
    const store = createStore({ preloadedState: { count: 1 } });
    expect(store.snapshot()).toEqual({});
    store.select(countBox);
    expect(store.snapshot()).toEqual({ count: 1 });
  });
});

describe('store.dispatch', () => {
  it('should dispatch mutation', () => {
    const store = createStore({ preloadedState: { count: 1 } });
    const r1 = store.dispatch(countBox.add(2));
    expect(r1).toEqual(2);
    expect(store.select(countBox)).toEqual(3);
  });

  it('should dispatch action', async () => {
    const store = createStore({ preloadedState: { count: 1 } });
    const r1 = await store.dispatch(addTwiceAsync(3));
    expect(r1).toEqual(6);
    expect(store.select(countBox)).toEqual(7);
  });

  it('should dispatch signal', () => {
    const store = createStore({ preloadedState: { count: 1 } });
    store.select(countBox);
    const r1 = store.dispatch(logout());
    expect(r1).toEqual({ count: 2 });
    expect(store.select(countBox)).toEqual(2);
  });

  it('should batch dispatch', async () => {
    const store = createStore({ preloadedState: { count: 1 } });
    store.select(countBox);
    const [r1, r2, r3] = await Promise.all(
      store.dispatch([logout(), addCount(2), addTwiceAsync(2)]),
    );
    expect(r1.count).toBe(2);
    expect(r2).toEqual(2);
    expect(r3).toEqual(4);
    expect(store.select(countBox)).toEqual(8);
  });
});

describe('store.subscribe', () => {
  it('should notify listeners', async () => {
    const store = createStore();
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

describe('select cache', () => {
  it('should not cache function', () => {
    const store = createStore();
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
