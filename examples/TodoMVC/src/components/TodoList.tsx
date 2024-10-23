/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { useQuery } from 'amos/react';
import { memo } from 'react';
import { getTodoList } from '../store/todo.actions';
import { TodoItem } from './TodoItem';

export const TodoList = memo(() => {
  const [todoList] = useQuery(getTodoList());
  return (
    <div>
      {todoList.map((id) => (
        <TodoItem key={id} id={id} />
      ))}
    </div>
  );
});
