/*
 * @since 2022-01-07 17:21:39
 * @author junbao <junbao@moego.pet>
 */

import { selector } from 'amos-core';
import { selectUserId } from './session.selectors';
import { userMapBox } from './user.boxes';

export const selectUser = selector((select, userId: number = select(selectUserId())) => {
  return select(userMapBox.getItem(userId));
});
