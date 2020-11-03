/*
 * @since 2020-11-03 15:38:15
 * @author acrazing <joking.young@gmail.com>
 */

import { selector } from '../../../selector';
import { Todo } from './todo_box';

export const selectVisibleMode = selector(Todo, (state) => state.visibleMode);

export const selectVisibleTodos = selector(
  Todo,
  (state) => {
    if (state.visibleMode === 'ALL') {
      return state.todos;
    }
    const done = state.visibleMode === 'DONE';
    return state.todos.filter((t) => t.done === done);
  },
  (state) => [state.visibleMode, state.todos],
);
