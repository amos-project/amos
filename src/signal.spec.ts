/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { signal } from './signal';

export interface LogoutEvent {
  count: number;
}

export const logout = signal('LOGOUT', (count: number): LogoutEvent => ({ count }));

describe('event', () => {
  it('should create event', () => {
    expect(typeof logout).toBe('function');
    expect(logout.type).toBe('LOGOUT');
    expect(logout(1)).toEqual({
      object: 'signal',
      type: 'LOGOUT',
      data: { count: 1 },
    });
  });
});
