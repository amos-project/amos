/*
 * @since 2022-01-06 18:13:19
 * @author junbao <junbao@moego.pet>
 */

import { action } from 'amos-core';
import { sleep } from '../utils';
import { selectUserId } from './session.selectors';
import { todoMapBox, TodoModel, userTodoListBox } from './todo.boxes';

export const addTodo = action(
  async (
    dispatch,
    select,
    input: Pick<TodoModel, 'title' | 'description'>,
    userId: number = select(selectUserId()),
  ) => {
    await sleep();
    const id = Math.random();
    dispatch([todoMapBox.mergeItem(id, input), userTodoListBox.unshiftIn(userId, id)]);
    return id;
  },
);
