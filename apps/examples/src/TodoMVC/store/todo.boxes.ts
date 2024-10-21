/*
 * @since 2024-10-18 23:40:53
 * @author junbao <junbao@moego.pet>
 */

import { listMapBox, recordMapBox } from 'amos-boxes';
import { box } from 'amos-core';
import { Record } from 'amos-shapes';
import { signOutSignal } from './user.boxes';

export interface TodoModel {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export class TodoRecord extends Record<TodoModel>({
  id: 0,
  userId: 0,
  title: '',
  completed: false,
}) {}

export const todoMapBox = recordMapBox('todos', TodoRecord, 'id');
export const userTodoListBox = listMapBox('todos.userTodoList', 0, 0);

signOutSignal.subscribe((dispatch, select, data) => {
  if (data.keepData) {
    return;
  }
  const userTodoList = select(userTodoListBox.getItem(data.userId));
  dispatch([todoMapBox.removeAll(userTodoList), userTodoListBox.removeItem(data.userId)]);
});

export enum TodoStatusFilter {
  All = 'All',
  New = 'New',
  Completed = 'Completed',
}

export const todoStatusFilterBox = box('todos.statusFilter', TodoStatusFilter.All);
