/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { LOGOUT, LogoutEvent, select } from 'amos-testing';
import { isAmosObject } from 'amos-utils';
import { pick } from 'lodash';

describe('event', () => {
  it('should create signal factory', () => {
    expect(LOGOUT).toEqual(expect.any(Function));
    expect(LOGOUT.subscribe).toBeInstanceOf(Function);
    expect(LOGOUT.dispatch).toBeInstanceOf(Function);
  });
  it('should create signal', () => {
    const e: LogoutEvent = { userId: 1, sessionId: 1 };
    const s = LOGOUT(e);
    expect(isAmosObject(s, 'signal')).toBe(true);
    expect(pick(s, 'args', 'creator', 'factory', 'type')).toEqual({
      args: [e],
      creator: expect.any(Function),
      factory: LOGOUT,
      type: 'session.logout',
    });
    expect(s.creator(select, ...s.args)).toBe(e);
  });
});
