/*
 * @since 2024-10-18 23:40:53
 * @author junbao <junbao@moego.pet>
 */

import { selector } from 'amos-core';
import { isSameList } from 'amos-shapes';
import { todoMapBox, TodoStatusFilter, todoStatusFilterBox, userTodoListBox } from './todo.boxes';
import { currentUserIdBox } from './user.boxes';

export const selectUserTodoList = selector((select, userId: number = select(currentUserIdBox)) => {
  return select(userTodoListBox.getItem(userId));
});

export const selectVisibleUserTodoList = selector(
  (select) => {
    const status = select(todoStatusFilterBox);
    const userTodoList = select(selectUserTodoList());
    if (status === TodoStatusFilter.All) {
      return userTodoList;
    }
    return userTodoList.filter((id) => {
      const todo = select(todoMapBox.getItem(id));
      return todo.completed === (status === TodoStatusFilter.Completed);
    });
  },
  {
    equal: isSameList,
  },
);
