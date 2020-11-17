/*
 * @since 2020-11-04 10:25:48
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, JSONState } from './box';
import { logout } from './signal.spec';
import { createStore } from './store';
import { identity } from './utils';
import fn = jest.fn;

export const countBox = new Box('count', 0, identity);

export function testTs() {
  interface Foo {
    id: number;
  }

  interface Bar {
    name: string;
  }

  interface Zoo {
    toJSON(): [Foo, Bar];
  }

  const zoo: JSONState<Zoo> = void 0 as any;

  zoo[0].id;
  zoo[1].name;
}

export interface TestStateModel {
  greets: string[];
  count: number;
}

export const testBox = new Box<TestStateModel>('test', { greets: [], count: 0 }, identity);

testBox.subscribe(logout, (state, data) => ({ greets: [], count: data.count }));

describe('box', () => {
  it('should create box', () => {
    expect(testBox.key).toBe('test');
    expect(testBox.initialState).toEqual({ greets: [], count: 0 });
    expect(testBox.preload({ greets: ['hello world'], count: 1 }, testBox.initialState)).toEqual({
      greets: ['hello world'],
      count: 1,
    });
  });
  it('should subscribe event', () => {
    const store = createStore();
    const eventBox = new Box('event', {}, identity);
    store.select(eventBox);
    const spy = fn(identity);
    eventBox.subscribe(logout, spy);
    store.dispatch(logout(1));
    expect(spy).toBeCalled();
  });
});

export const increment = countBox.mutation((state) => state + 1);
export const addCount = countBox.mutation((state, action: number = 1) => state + action);

export interface MergeTestAction {
  count?: number;
  greets?: string[];
}

export const mergeTest = testBox.mutation((state, { count, greets }: MergeTestAction) => {
  return {
    ...state,
    count: count ?? state.count,
    greets: greets?.length ? state.greets.concat(greets) : state.greets,
  };
}, 'mergeTest');

export const setCount = testBox.mutation(
  (state, action: number) => ({
    ...state,
    count: action,
  }),
  'setCount',
);

describe('mutation', () => {
  it('should create mutation', () => {
    const mutation = mergeTest({});
    expect(mutation.box).toBe(testBox);
    expect(mutation.type).toBe('mergeTest');
    expect(
      mutation.mutator({ count: 1, greets: ['hello'] }, { count: 2, greets: ['world'] }),
    ).toEqual({
      count: 2,
      greets: ['hello', 'world'],
    });
  });
});
