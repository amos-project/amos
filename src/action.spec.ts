/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { action } from './action';
import { Test } from './box.spec';
import { mergeTest } from './mutation.spec';

export const dummyFetch = <T>(input: T) => Promise.resolve(input);

export const addGreet = action(async ({ dispatch, pick }, greet: string) => {
  await dummyFetch(greet);
  return dispatch(mergeTest({ greets: [greet], count: pick(Test).count + 1 }));
}, 'ADD_GREET');

describe('action', () => {
  it('should create action', () => {
    const action = addGreet('hello world');
    expect(action.object).toBe('action');
    expect(action.type).toBe('ADD_GREET');
    expect(typeof action).toBe('function');
  });
});
