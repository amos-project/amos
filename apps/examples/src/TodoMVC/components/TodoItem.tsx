/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { useDispatch, useSelector } from 'amos-react';
import React, { memo } from 'react';
import { completeTodo, deleteTodo } from '../store/todo.actions';
import { todoMapBox } from '../store/todo.boxes';

export const TodoItem = memo(({ id }: { id: number }) => {
  const dispatch = useDispatch();
  const [todo] = useSelector(todoMapBox.getItem(id));
  return (
    <div>
      <span>{todo.title}</span>
      {todo.completed ? null : (
        <button onClick={() => dispatch(completeTodo(id))}>Mark as completed</button>
      )}
      <button onClick={() => dispatch(deleteTodo(id))}>Delete</button>
    </div>
  );
});
