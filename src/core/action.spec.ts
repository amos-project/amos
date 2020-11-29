/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { action } from './action';
import { addCount } from './box.spec';

export const addTwiceAsync = action(async (dispatch, select, base: number) => {
  await Promise.resolve();
  return dispatch(addCount(base * 2));
}, 'ADD_TWICE_ASYNC');

describe('action', () => {
  it('should create action', () => {
    const { actor, ...other } = addTwiceAsync(2);
    expect(other).toEqual({ type: 'ADD_TWICE_ASYNC', args: [2], object: 'action' });
    expect(typeof actor).toBe('function');
  });
});
