/*
 * @since 2022-01-06 18:13:19
 * @author junbao <junbao@moego.pet>
 */

import { createListMapBox, createRecordMapBox } from 'amos-boxes';
import { Record } from 'amos-shapes';
import { createStrictEnum, EnumValues } from 'amos-utils';
import { userMapBox } from './user.boxes';

export const TodoStatus = createStrictEnum({
  created: [1, { group: 'TODO' }],
  started: [2, { group: 'IN PROGRESS' }],
  finished: [3, { group: 'DONE' }],
  deleted: [4, { group: 'BACKLOG' }],
});

export interface TodoModel {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: EnumValues<typeof TodoStatus>;
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
      const field = `${TodoStatus.key(this.status)}At` as const;
      return this.get(field) - t.get(field);
    }
    return this.status - t.status;
  }
}

export const todoMapBox = createRecordMapBox('todos', TodoRecord, 'id').relations({
  user: ['userId', userMapBox],
});

export const userTodoListBox = createListMapBox('todos.userList', 0, 0);
