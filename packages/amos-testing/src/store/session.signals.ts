/*
 * @since 2022-01-07 17:18:07
 * @author junbao <junbao@moego.pet>
 */

import { signal } from 'amos-core';

export interface LogoutEvent {
  userId: number;
}

export const LOGOUT = signal<LogoutEvent>('LOGOUT');
