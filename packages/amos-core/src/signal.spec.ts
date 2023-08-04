/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { LOGOUT } from 'amos-testing';

describe('event', () => {
  it('should create signal factory', () => {
    expect(LOGOUT).toBe(expect.any(Function));
    expect({ ...LOGOUT }).toEqual({ $object: 'signal_factory', type: 'RESET' });
  });
  it('should create signal', () => {
    expect(LOGOUT({ userId: 1 })).toEqual({
      $object: 'signal',
      type: 'RESET',
      data: { count: 0 },
    });
  });
});
