/*
 * @since 2022-01-06 18:13:19
 * @author junbao <junbao@moego.pet>
 */

import { action } from 'amos-core';
import { sleep, todoMapBox, TodoModel, userTodoListBox } from 'amos-testing';
import { selectUserId } from './session.selectors';

export const addTodo = action(
  async (
    dispatch,
    select,
    input: Pick<TodoModel, 'title' | 'description'>,
    userId: number = select(selectUserId()),
  ) => {
    await sleep();
    const id = Math.random();
    dispatch([todoMapBox.merge(id, input), userTodoListBox.unshiftList(userId, id)]);
  },
);
