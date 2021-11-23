/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { reset } from 'amos-testing';

describe('event', () => {
  it('should create signal factory', () => {
    expect(reset).toBe(expect.any(Function));
    expect({ ...reset }).toEqual({ $object: 'signal_factory', type: 'RESET' });
  });
  it('should create signal', () => {
    expect(reset(0)).toEqual({
      $object: 'signal',
      type: 'RESET',
      data: { count: 0 },
    });
  });
});
