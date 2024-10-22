/*
 * @since 2022-01-07 17:07:11
 * @author junbao <junbao@moego.pet>
 */

import { recordMapBox } from 'amos-boxes';
import { box } from 'amos-core';
import { Record } from 'amos-shapes';

export interface SessionModel {
  id: number;
  token: string;
  userId: number;
}

export class SessionRecord extends Record<SessionModel>({
  id: 0,
  token: '',
  userId: 0,
}) {
  isAnonymous() {
    return this.userId > 0;
  }
}

export const sessionMapBox = recordMapBox('sessions', SessionRecord, 'id');
export const sessionIdBox = box('sessions.currentId', 0);