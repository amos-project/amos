/*
 * @since 2020-11-04 10:25:48
 * @author acrazing <joking.young@gmail.com>
 */

import { atom, box } from './box';

export interface TestStateModel {
  greets: string[];
  count: number;
}

export const TestBox = box<TestStateModel>(
  'testBox',
  () => ({ greets: [], count: 0 }),
  (state, preloadedState) => preloadedState,
);

export interface MergeTestAction {
  count?: number;
  greets?: string[];
}

export const mergeTest = atom(
  TestBox,
  (state, { count, greets }: MergeTestAction) => ({
    ...state,
    count: count ?? state.count,
    greets: greets?.length ? state.greets.concat(greets) : state.greets,
  }),
  'mergeTest',
);

export const setCount = atom(
  TestBox,
  (state, action: number) => ({
    ...state,
    count: action,
  }),
  'setCount',
);

describe('box', () => {
  it('should create box', () => {
    expect(TestBox.key).toBe('testBox');
    expect(TestBox.initialState()).toEqual({ greets: [], count: 0 });
    expect(TestBox.preload(TestBox.initialState(), { greets: ['hello world'], count: 1 })).toEqual({
      greets: ['hello world'],
      count: 1,
    });
  });
});

describe('atom', () => {
  it('should create atom', () => {
    expect(mergeTest.box).toBe(TestBox);
    expect(mergeTest.type).toBe('mergeTest');
    expect(
      mergeTest.atom({ count: 1, greets: ['hello'] }, { count: 2, greets: ['world'] }),
    ).toEqual({
      count: 2,
      greets: ['hello', 'world'],
    });
  });
});
