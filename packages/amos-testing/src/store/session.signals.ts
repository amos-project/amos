/*
 * @since 2022-01-07 17:18:07
 * @author junbao <junbao@moego.pet>
 */

import { signal } from 'amos-core';

export interface LogoutEvent {
  userId: number;
  sessionId: number;
}

export const LOGOUT = signal<LogoutEvent>('session.logout');

export interface LoginEvent {
  userId: number;
  sessionId: number;
}

export const LOGIN = signal<LoginEvent>('session.login');
