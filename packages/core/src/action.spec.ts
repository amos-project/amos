/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { addTwiceAsync } from '@kcats/testing';

describe('action', () => {
  it('should create action', () => {
    const { actor, ...other } = addTwiceAsync(2);
    expect(other).toEqual({ type: 'ADD_TWICE_ASYNC', args: [2], object: 'action' });
    expect(typeof actor).toBe('function');
  });
});
