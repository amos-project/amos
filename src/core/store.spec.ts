/*
 * @since 2020-11-04 10:51:44
 * @author acrazing <joking.young@gmail.com>
 */

import { addTwiceAsync } from './action.spec';
import { addCount, countBox, mergeUser, userBox, UserModel } from './box.spec';
import { selector } from './selector';
import { reset } from './signal.spec';
import { createStore, Select } from './store';
import { arrayEqual } from './utils';
import { expectCalled } from './utils.spec';
import fn = jest.fn;

describe('createStore', () => {
  it('should create store', () => {
    const store = createStore();
    expect(store.snapshot).toBeDefined();
    expect(store.dispatch).toBeDefined();
    expect(store.subscribe).toBeDefined();
    expect(store.select).toBeDefined();
    expect(store.clearBoxes).toBeDefined();
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
    const store = createStore({ count: 1 });
    expect(store.select(countBox)).toEqual(1);
  });
});

describe('store.snapshot', () => {
  it('should take snapshot', () => {
    const store = createStore({ count: 1 });
    expect(store.snapshot()).toEqual({});
    store.select(countBox);
    expect(store.snapshot()).toEqual({ count: 1 });
  });
});

describe('store.dispatch', () => {
  it('should dispatch mutation', () => {
    const store = createStore({ count: 1 });
    const r1 = store.dispatch(addCount(2));
    expect(r1).toEqual(2);
    expect(store.select(countBox)).toEqual(3);
  });

  it('should dispatch action', async () => {
    const store = createStore({ count: 1 });
    const r1 = await store.dispatch(addTwiceAsync(3));
    expect(r1).toEqual(6);
    expect(store.select(countBox)).toEqual(7);
  });

  it('should dispatch signal', () => {
    const store = createStore({ count: 1 });
    store.select(countBox);
    const r1 = store.dispatch(reset(2));
    expect(r1).toEqual({ count: 2 });
    expect(store.select(countBox)).toEqual(2);
  });

  it('should batch dispatch', async () => {
    const store = createStore({ count: 1 });
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

describe('store.clearBoxes', () => {
  it('should clear boxes', () => {
    const store = createStore({
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
    store.clearBoxes(true);
    expectCalled(fakeFn);
    const u3 = store.select(userBox);
    expect(u3).toEqual(u2);
    expect(u3).not.toBe(u2);
  });
});

describe('select cache', () => {
  it('should not cache function', () => {
    const store = createStore();
    const selectUesrFunction = fn((select: Select) => select(userBox));
    const selectUserDefault = selector(fn((select: Select) => select(selectUesrFunction)));
    const selectUserId = selector(fn((select: Select) => select(selectUserDefault).id));
    const selectUserIdAdd = selector(
      fn((select: Select, add: number) => select(selectUserId) + add),
    );
    const selectUserFullName = selector(
      fn((select: Select) => select(selectUserDefault).fullName()),
      (select) => {
        const user = select(selectUserDefault);
        return [user.firstName, user.lastName];
      },
    );
    const selectUserNamePair = selector(
      fn((select: Select) => [
        select(selectUserDefault).firstName,
        select(selectUserDefault).lastName,
      ]),
      void 0,
      arrayEqual,
    );
  });
});