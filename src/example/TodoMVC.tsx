/*
 * @since 2020-11-03 16:05:29
 * @author acrazing <joking.young@gmail.com>
 */

import React, { memo } from 'react';
import { useDispatch, useSelector } from '../hooks';
import {
  addTodoAsync,
  removeTodoAsync,
  setVisibleMode,
  updateTodoAsync,
} from './store/todo/todo_actions';
import { TodoVisibleMode } from './store/todo/todo_box';
import { selectVisibleMode, selectVisibleTodos } from './store/todo/todo_selectors';

export interface TodoMVCProps {
  className?: string;
}

export const TodoMVC = memo<TodoMVCProps>(({ className }) => {
  const [visibleMode, todos] = useSelector(selectVisibleMode(), selectVisibleTodos());
  const dispatch = useDispatch();
  const handleKeyup = async ({ currentTarget, keyCode }: React.KeyboardEvent<HTMLInputElement>) => {
    const value = currentTarget.value.trim();
    if (keyCode === 13 && value) {
      await dispatch(addTodoAsync(value));
      currentTarget.value = '';
    }
  };
  const handleSetVisibleMode = (mode: TodoVisibleMode) => {
    dispatch(setVisibleMode(mode));
  };
  const handleDone = async (id: number) => {
    await dispatch(updateTodoAsync({ id, done: true }));
  };
  const handleDelete = async (id: number) => {
    await dispatch(removeTodoAsync(id));
  };
  return (
    <div className={className}>
      <div className="input">
        <input placeholder="Please input the task name" onKeyUp={handleKeyup} />
      </div>
      <div className="filter">
        <span>SHOW:</span>
        {([] as TodoVisibleMode[]).map((mode) => (
          <label key={mode} onClick={() => handleSetVisibleMode(mode)}>
            <input type="radio" checked={mode === visibleMode} name="mode" />
            <span>{mode}</span>
          </label>
        ))}
      </div>
      <div className="todo-list">
        {todos.map((t) => (
          <div className="item" key={t.id}>
            <span>{t.title}</span>
            {t.done || <button onClick={() => handleDone(t.id)}>DONE</button>}
            <button onClick={() => handleDelete(t.id)}>DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
});
