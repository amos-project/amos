/*
 * @since 2020-11-04 10:25:48
 * @author acrazing <joking.young@gmail.com>
 */

import { box } from './box';
import { logout } from './event.spec';
import { createStore } from './store';
import { identity } from './utils';
import fn = jest.fn;

export const count = box('count', 0, identity);

export interface TestStateModel {
  greets: string[];
  count: number;
}

export const Test = box<TestStateModel>('test', { greets: [], count: 0 }, identity);

Test.subscribe(logout, (state, data) => ({ greets: [], count: data.count }));

describe('box', () => {
  it('should create box', () => {
    expect(Test.key).toBe('test');
    expect(Test.initialState).toEqual({ greets: [], count: 0 });
    expect(Test.preload({ greets: ['hello world'], count: 1 }, Test.initialState)).toEqual({
      greets: ['hello world'],
      count: 1,
    });
  });
  it('should subscribe event', () => {
    const store = createStore();
    const Box = box('event', {}, identity);
    store.select(Box);
    const spy = fn(identity);
    Box.subscribe(logout, spy);
    store.dispatch(logout(1));
    expect(spy).toBeCalled();
  });
});
