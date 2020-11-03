/*
 * @since 2020-11-03 15:38:15
 * @author acrazing <joking.young@gmail.com>
 */

import { selector } from '../../../selector';
import { Todo } from './todo_box';

export const selectVisibleMode = selector(({ get }) => get(Todo).visibleMode);

export const selectVisibleTodos = selector(({ get }) => {
  const todos = get(Todo);
  if (todos.visibleMode === 'ALL') {
    return todos.todos;
  }
  const done = todos.visibleMode === 'DONE';
  return todos.todos.filter((t) => t.done === done);
});
