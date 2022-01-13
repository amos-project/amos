/*
 * @since 2022-01-07 17:21:39
 * @author junbao <junbao@moego.pet>
 */

import { selector } from 'amos-core';
import { userMapBox } from 'amos-testing';
import { selectUserId } from './session.selectors';

export const selectUser = selector((select, userId: number = select(selectUserId())) => {
  return select(userMapBox.getItem(userId));
});
