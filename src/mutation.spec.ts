/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { count, Test } from './box.spec';
import { mutation } from './mutation';

export const increment = mutation(count, (state) => state + 1);

export interface MergeTestAction {
  count?: number;
  greets?: string[];
}

export const mergeTest = mutation(
  Test,
  (state, { count, greets }: MergeTestAction) => {
    return {
      ...state,
      count: count ?? state.count,
      greets: greets?.length ? state.greets.concat(greets) : state.greets,
    };
  },
  'mergeTest',
);

export const setCount = mutation(
  Test,
  (state, action: number) => ({
    ...state,
    count: action,
  }),
  'setCount',
);

describe('mutation', () => {
  it('should create mutation', () => {
    const mutation = mergeTest({});
    expect(mutation.box).toBe(Test);
    expect(mutation.type).toBe('mergeTest');
    expect(
      mutation.mutator({ count: 1, greets: ['hello'] }, { count: 2, greets: ['world'] }),
    ).toEqual({
      count: 2,
      greets: ['hello', 'world'],
    });
  });
});
