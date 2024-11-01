/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { useSelector } from 'amos/react';
import { memo } from 'react';
import { selectVisibleUserTodoList } from '../store/todo.selectors';
import { TodoItem } from './TodoItem';

export const TodoList = memo(() => {
  const todoList = useSelector(selectVisibleUserTodoList());
  return (
    <div>
      {todoList.map((id) => (
        <TodoItem key={id} id={id} />
      ))}
    </div>
  );
});
