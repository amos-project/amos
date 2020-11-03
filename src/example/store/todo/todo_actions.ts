/*
 * @since 2020-11-03 15:38:15
 * @author acrazing <joking.young@gmail.com>
 */

import { action } from '../../../action';
import {
  addTodo,
  mergeTodos,
  removeTodo,
  TodoVisibleMode,
  updateTodo,
  UpdateTodoAction,
} from './todo_box';

async function dummyFetch<R>(req: R): Promise<R> {
  return req;
}

export const loadTodos = action(async (store, dispatch, limit: number = 10) => {
  const todos = await dummyFetch(
    Array(limit)
      .fill(0)
      .map((_, id) => ({ id, title: 'Task ' + id, done: id % 3 === 0 })),
  );
  return dispatch(mergeTodos({ todos }));
});

export const setVisibleMode = action((store, dispatch, visibleMode: TodoVisibleMode) => {
  return dispatch(mergeTodos({ visibleMode }));
});

export const addTodoAsync = action(async (store, dispatch, title: string) => {
  const todo = await dummyFetch({ id: Date.now(), title, done: false });
  return dispatch(addTodo(todo));
});

export const updateTodoAsync = action(async (store, dispatch, input: UpdateTodoAction) => {
  await dummyFetch(input);
  return dispatch(updateTodo(input));
});

export const removeTodoAsync = action(async (store, dispatch, id: number) => {
  await dummyFetch(id);
  return dispatch(removeTodo(id));
});
