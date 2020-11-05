/*
 * @since 2020-11-04 10:51:44
 * @author acrazing <joking.young@gmail.com>
 */

import { action } from './action';
import { addGreet } from './action.spec';
import { TestBox } from './box.spec';
import { mergeTest, setCount } from './mutation.spec';
import { createStore } from './store';
import fn = jest.fn;

describe('store', () => {
  it('should create store with preloaded state', () => {
    const s1 = createStore();
    expect(s1.pick(TestBox)).toEqual({ count: 0, greets: [] });
    const s2 = createStore({ [TestBox.key]: { count: 1, greets: ['hello world'] } });
    expect(s2.pick(TestBox)).toEqual({ count: 1, greets: ['hello world'] });
  });

  it('should dispatch action', async () => {
    const store = createStore();
    expect(store.pick(TestBox).count).toBe(0);
    const r1 = await store.dispatch(addGreet('hello'));
    expect(r1).toEqual({ count: 1, greets: ['hello'] });
    expect(store.pick(TestBox).count).toBe(1);
    const [r2] = await Promise.all(store.dispatch([setCount(2), addGreet('2')]));
    expect(r2).toBe(2);
    expect(store.pick(TestBox).count).toEqual(3);
    await Promise.resolve();
    expect(store.pick(TestBox).count).toBe(3);
    const [r3, r4] = store.dispatch([setCount(4), addGreet('3')]);
    expect(r3 === 4).toBe(true);
    expect((await r4).count).toBe(5);
  });

  it('should notify listeners', async () => {
    const store = createStore();
    const addGreet2 = action((store, title: string) => {
      return store.dispatch([
        mergeTest({
          greets: [title, title.repeat(2)],
        }),
        setCount(store.pick(TestBox).count + 2),
      ]);
    });
    const listener = fn();
    const disposer = store.subscribe(listener);
    store.dispatch([setCount(1), setCount(2)]);
    expect(listener).toBeCalledTimes(1);
    listener.mockClear();
    store.dispatch(addGreet2('hello'));
    expect(listener).toBeCalledTimes(1);
    listener.mockClear();
    await Promise.all(store.dispatch([setCount(2), addGreet('world')]));
    expect(listener).toBeCalledTimes(2);
    disposer();
    listener.mockClear();
    store.dispatch(setCount(1));
    expect(listener).toBeCalledTimes(0);
  });
});
