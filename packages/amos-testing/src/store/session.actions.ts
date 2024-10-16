/*
 * @since 2022-01-07 17:07:11
 * @author junbao <junbao@moego.pet>
 */

import { action } from 'amos-core';
import { sessionIdBox, sessionMapBox } from './session.boxes';
import { selectSession } from './session.selectors';
import { LOGOUT } from './session.signals';
import { sleep } from '../utils';

export const login = action(async (dispatch, select, userId: number) => {
  await sleep();
  const id = Math.random();
  dispatch([sessionMapBox.mergeItem(id, { userId }), sessionIdBox.setState(id)]);
});

export const logout = action(async (dispatch, select) => {
  await sleep();
  const session = select(selectSession());
  dispatch([
    sessionMapBox.delete(session.id),
    sessionIdBox.resetState(),
    LOGOUT({ userId: session.userId }),
  ]);
});
