/*
 * @since 2020-11-03 15:38:15
 * @author acrazing <joking.young@gmail.com>
 */

import { List, Record } from 'immutable';
import { box } from '../../../box';
import { RecordProps } from './todo_actions';

export type PartialRequired<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>;

export class TodoRecord extends Record({
  id: 0,
  title: '',
  done: false,
}) {}

export type TodoVisibleMode = 'ALL' | 'DONE' | 'NEW';

export interface MergeTodoAction {
  visibleMode?: TodoVisibleMode;
  todos?: PartialRequired<RecordProps<TodoRecord>, 'id'>[];
}

export class TodoStateRecord extends Record({
  visibleMode: 'ALL' as TodoVisibleMode,
  todos: List<TodoRecord>(),
}) {}

function mergeState(
  state: TodoStateRecord,
  { visibleMode, todos }: MergeTodoAction,
) {
  return state.merge({
    visibleMode: visibleMode ?? state.visibleMode,
    todos: todos
      ? state.todos.withMutations((state) => {
          todos.forEach((item) => {
            const index = state.findIndex((t) => t.id === item.id);
            if (index > -1) {
              state.update(index, (t) => t.merge(item));
            } else {
              state.push(new TodoRecord(item));
            }
          });
        })
      : state.todos,
  });
}

export const Todo = box('todo', new TodoStateRecord(), {
  preload: (state, preloadedState) => mergeState(state, preloadedState),
  mutators: {
    merge: (state, action: MergeTodoAction) => mergeState(state, action),
    add: (state, action: RecordProps<TodoRecord>) => {
      return state.merge({
        todos: state.todos.unshift(new TodoRecord(action)),
      });
    },
    update: (state, action: PartialRequired<RecordProps<TodoRecord>, 'id'>) => {
      const index = state.todos.findIndex((t) => t.id === action.id);
      return index > -1
        ? state.merge({
            todos: state.todos.update(index, (t) => t.merge(action)),
          })
        : state;
    },
    remove: (state, action: PartialRequired<RecordProps<TodoRecord>, 'id'>) => {
      const index = state.todos.findIndex((t) => t.id === action.id);
      return index > -1
        ? state.merge({
            todos: state.todos.remove(index),
          })
        : state;
    },
  },
});
