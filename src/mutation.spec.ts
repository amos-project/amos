/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { TestBox } from './box.spec';
import { mutation } from './mutation';

export interface MergeTestAction {
  count?: number;
  greets?: string[];
}

export const mergeTest = mutation(
  TestBox,
  (state, { count, greets }: MergeTestAction) => ({
    ...state,
    count: count ?? state.count,
    greets: greets?.length ? state.greets.concat(greets) : state.greets,
  }),
  'mergeTest',
);

export const setCount = mutation(
  TestBox,
  (state, action: number) => ({
    ...state,
    count: action,
  }),
  'setCount',
);

describe('mutation', () => {
  it('should create mutation', () => {
    expect(mergeTest.box).toBe(TestBox);
    expect(mergeTest.type).toBe('mergeTest');
    expect(
      mergeTest.mutation({ count: 1, greets: ['hello'] }, { count: 2, greets: ['world'] }),
    ).toEqual({
      count: 2,
      greets: ['hello', 'world'],
    });
  });
});
