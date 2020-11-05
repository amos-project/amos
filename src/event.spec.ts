/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { event } from './event';

export interface LogoutEvent {
  count: number;
}

export const logout = event((count: number): LogoutEvent => ({ count }), 'LOGOUT');

describe('event', () => {
  it('should create event', () => {
    expect(typeof logout).toBe('function');
    expect(logout(1)).toEqual({
      object: 'event',
      type: 'LOGOUT',
      factory: logout,
      data: { count: 1 },
    });
  });
});
