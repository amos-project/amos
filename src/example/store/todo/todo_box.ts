/*
 * @since 2020-11-03 15:38:15
 * @author acrazing <joking.young@gmail.com>
 */

import { box } from '../../../box';
import { mutation } from '../../../mutation';
import { identity } from '../../../utils';

export type PartialRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

export interface TodoModel {
  id: number;
  title: string;
  done: boolean;
}

export type TodoVisibleMode = 'ALL' | 'DONE' | 'NEW';

export interface TodoStateModel {
  visibleMode: TodoVisibleMode;
  todos: TodoModel[];
}

export const Todo = box<TodoStateModel>(
  'todo',
  {
    visibleMode: 'ALL',
    todos: [],
  },
  identity,
);

function mergeList<T, K extends keyof T>(
  original: T[],
  added: PartialRequired<T, K>[] | undefined,
  key: K,
  defaults: T,
) {
  if (!added?.length) {
    return original;
  }
  original = original.slice();
  for (const item of added) {
    const index = original.findIndex((o) => o[key] === ((item[key] as unknown) as T[K]));
    if (index === -1) {
      original.unshift({ ...defaults, ...item });
    } else {
      original[index] = { ...original[index], ...item };
    }
  }
  return original;
}

export interface MergeTodosAction {
  visibleMode?: TodoVisibleMode;
  todos?: PartialRequired<TodoModel, 'id'>[];
}

export const mergeTodos = mutation(Todo, (state, { visibleMode, todos }: MergeTodosAction) => ({
  visibleMode: visibleMode ?? state.visibleMode,
  todos: mergeList(state.todos, todos, 'id', {
    id: 0,
    done: false,
    title: '',
  }),
}));

export const addTodo = mutation(Todo, (state, action: TodoModel) => ({
  ...state,
  todos: [action].concat(state.todos),
}));

export type UpdateTodoAction = PartialRequired<TodoModel, 'id'>;

export const updateTodo = mutation(Todo, (state, action: UpdateTodoAction) => ({
  ...state,
  todos: state.todos.map((t) => (t.id === action.id ? { ...t, ...action } : t)),
}));

export const removeTodo = mutation(Todo, (state, action: number) => ({
  ...state,
  todos: state.todos.filter((t) => t.id !== action),
}));
