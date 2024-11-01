/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { useDispatch, useSelector } from 'amos/react';
import { memo } from 'react';
import { completeTodo, deleteTodo } from '../store/todo.actions';
import { todoMapBox } from '../store/todo.boxes';

export const TodoItem = memo(({ id }: { id: number }) => {
  const dispatch = useDispatch();
  const todo = useSelector(todoMapBox.getItem(id));
  return (
    <div className="todo flex">
      <strong>{todo.title}</strong>
      &nbsp;
      <span className="expand" />
      {todo.completed ? null : (
        <button onClick={() => dispatch(completeTodo(id))}>Mark as completed</button>
      )}
      &nbsp;
      <button onClick={() => dispatch(deleteTodo(id))}>Delete</button>
    </div>
  );
});
