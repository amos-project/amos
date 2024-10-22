/*
 * @since 2024-10-18 23:40:53
 * @author junbao <junbao@moego.pet>
 */

import { action } from 'amos';
import { todoMapBox, TodoModel, userTodoListBox } from './todo.boxes';
import { selectUserTodoList, selectVisibleUserTodoList } from './todo.selectors';
import { doAsync } from './user.actions';
import { currentUserIdBox } from './user.boxes';

export const addTodo = action(async (dispatch, select, title: string) => {
  const todo = await doAsync<TodoModel>({
    id: Math.random(),
    userId: select(currentUserIdBox),
    title: title,
    completed: false,
  });
  dispatch([todoMapBox.mergeItem(todo), userTodoListBox.unshiftIn(todo.userId, todo.id)]);
});

export const completeTodo = action(async (dispatch, select, id: number) => {
  await doAsync(void 0);
  dispatch(todoMapBox.mergeItem(id, { completed: true }));
});

export const deleteTodo = action(async (dispatch, select, id: number) => {
  await doAsync(void 0);
  dispatch([todoMapBox.removeItem(id), userTodoListBox.deleteIn(select(currentUserIdBox), id)]);
});

export const getTodoList = action(
  async (dispatch, select) => {
    const todos = await doAsync(
      select(selectUserTodoList()).map((id) => select(todoMapBox.getItem(id)).toJSON()),
    );
    dispatch([
      todoMapBox.mergeAll(todos),
      userTodoListBox.setItem(
        select(currentUserIdBox),
        todos.map((t) => t.id),
      ),
    ]);
  },
  {
    conflictKey: currentUserIdBox,
  },
).select(selectVisibleUserTodoList);
