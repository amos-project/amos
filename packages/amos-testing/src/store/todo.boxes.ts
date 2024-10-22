/*
 * @since 2022-01-06 18:13:19
 * @author junbao <junbao@moego.pet>
 */

import { listMapBox, recordMapBox } from 'amos-boxes';
import { Record } from 'amos-shapes';
import { enumLabels } from '../utils';

export enum TodoStatus {
  created = 1,
  started = 2,
  finished = 3,
  deleted = 4,
}

export type TodoStatusLabel = {
  group: string;
};

export type TodoStatusKey = keyof typeof TodoStatus;

export const TodoStatusLabels = enumLabels<typeof TodoStatus, TodoStatusLabel>(TodoStatus, {
  created: { group: 'TODO' },
  started: { group: 'IN PROGRESS' },
  finished: { group: 'DONE' },
  deleted: { group: 'BACKLOG' },
});

export interface TodoModel {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: number;
  startedAt: number;
  finishedAt: number;
  deletedAt: number;
}

export class TodoRecord extends Record<TodoModel>({
  id: 0,
  userId: 0,
  title: '',
  description: '',
  status: TodoStatus.created,
  createdAt: 0,
  startedAt: 0,
  finishedAt: 0,
  deletedAt: 0,
}) {
  compareTo(t: TodoRecord) {
    if (this.status === t.status) {
      const field = `${TodoStatus[this.status] as TodoStatusKey}At` as const;
      return this.get(field) - t.get(field);
    }
    return this.status - t.status;
  }
}

export const todoMapBox = recordMapBox('todos', TodoRecord, 'id');

export const userTodoListBox = listMapBox('todos.userList', 0, 0);
