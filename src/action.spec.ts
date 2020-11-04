/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { action } from './action';
import { mergeTest, TestBox } from './box.spec';

export const dummyFetch = <T>(input: T) => Promise.resolve(input);

export const addGreet = action(async ({ dispatch, pick }, greet: string) => {
  await dummyFetch(greet);
  return dispatch(mergeTest({ greets: [greet], count: pick(TestBox).count + 1 }));
}, 'addGreet');

describe('action', () => {
  it('should create action', () => {
    expect(addGreet.type).toBe('addGreet');
    expect(typeof addGreet.action).toBe('function');
  });
});
