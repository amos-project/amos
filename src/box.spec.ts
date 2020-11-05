/*
 * @since 2020-11-04 10:25:48
 * @author acrazing <joking.young@gmail.com>
 */

import { box } from './box';

export interface TestStateModel {
  greets: string[];
  count: number;
}

export const TestBox = box<TestStateModel>(
  'testBox',
  () => ({ greets: [], count: 0 }),
  (state, preloadedState) => preloadedState,
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
