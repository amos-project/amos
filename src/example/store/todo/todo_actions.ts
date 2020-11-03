/*
 * @since 2020-11-03 15:38:15
 * @author acrazing <joking.young@gmail.com>
 */

import { Record } from 'immutable';
import { action } from '../../../action';
import { PartialRequired, Todo, TodoRecord, TodoVisibleMode } from './todo_box';

export type RecordProps<R> = R extends Record<infer P> ? P : never;

async function dummyFetch<R>(req: R): Promise<R> {
  return req;
}

export const loadTodos = action(async ({ box, batch }, limit: number = 10) => {
  const todos = await dummyFetch(
    Array(limit)
      .fill(0)
      .map((_, id) => ({ id, title: 'Task ' + id, done: id % 3 === 0 })),
  );
  box(Todo).merge({ todos });
});

export const setVisibleMode = action(({ box }, mode: TodoVisibleMode) => {
  return box(Todo).merge({ visibleMode: mode });
});

export const addTodo = action(async ({ box }, title: string) => {
  const todo = await dummyFetch({ id: Date.now(), title, done: false });
  return box(Todo).add(todo);
});

export const updateTodo = action(
  async ({ box }, input: PartialRequired<RecordProps<TodoRecord>, 'id'>) => {
    await dummyFetch(input);
    return box(Todo).update(input);
  },
);

export const removeTodo = action(async ({ box }, id: number) => {
  await dummyFetch(id);
  return box(Todo).remove({ id });
});
