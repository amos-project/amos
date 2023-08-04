/*
 * @since 2022-01-06 18:13:19
 * @author junbao <junbao@moego.pet>
 */

import { selector } from 'amos-core';
import { userTodoListBox } from 'amos-testing';
import { selectUserId } from './session.selectors';

export const selectTodoList = selector((select, userId: number = select(selectUserId())) => {
  return select(userTodoListBox.getItem(userId));
});
