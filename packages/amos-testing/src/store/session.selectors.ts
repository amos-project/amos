/*
 * @since 2022-01-07 17:07:11
 * @author junbao <junbao@moego.pet>
 */

import { selector } from 'amos-core';
import { sessionIdBox, sessionMapBox } from './session.boxes';

export const selectSession = selector((select, sessionId: number = select(sessionIdBox)) => {
  return select(sessionMapBox.getOrDefault(sessionId));
});

export const selectUserId = selector((select, sessionId: number = select(sessionIdBox)) => {
  return select(selectSession(sessionId)).userId;
});
