/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { event } from './event';

const logout = event((id: number) => ({ id }), 'logout');

describe('event', () => {
  it('should create event', () => {
    expect(typeof logout).toBe('function');
    expect(logout(1)).toEqual({
      object: 'event',
      type: 'logout',
      factory: logout,
      data: { id: 1 },
    });
  });
});
