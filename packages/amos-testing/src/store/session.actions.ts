/*
 * @since 2022-01-07 17:07:11
 * @author junbao <junbao@moego.pet>
 */

import { action } from 'amos-core';
import { sleep } from '../utils';
import { sessionIdBox, sessionMapBox } from './session.boxes';
import { selectSession } from './session.selectors';
import { LOGIN, LOGOUT } from './session.signals';

export const loginSync = action((dispatch, select, userId: number) => {
  const id = Math.random();
  dispatch([sessionMapBox.mergeItem(id, { userId }), sessionIdBox.setState(id)]);
  dispatch(LOGIN({ userId, sessionId: id }));
  return id;
});

export const loginAsync = action(async (dispatch, select, userId: number) => {
  await sleep();
  return dispatch(loginSync(userId));
});

export const logoutSync = action((dispatch, select) => {
  const session = select(selectSession());
  dispatch([sessionIdBox.setState()]);
  dispatch(LOGOUT({ userId: session.userId, sessionId: session.id }));
});

export const logoutAsync = action(async (dispatch) => {
  await sleep();
  return dispatch(logoutSync());
});
