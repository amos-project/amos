/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { logoutSignal } from 'amos-testing';

describe('event', () => {
  it('should create signal factory', () => {
    expect(logoutSignal).toBe(expect.any(Function));
    expect({ ...logoutSignal }).toEqual({ $object: 'signal_factory', type: 'RESET' });
  });
  it('should create signal', () => {
    expect(logoutSignal({ userId: 1 })).toEqual({
      $object: 'signal',
      type: 'RESET',
      data: { count: 0 },
    });
  });
});
