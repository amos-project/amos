/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { useDispatch, useSelector } from 'amos/react';
import { memo, useState } from 'react';
import { addTodo } from '../store/todo.actions';
import { TodoStatusFilter, todoStatusFilterBox } from '../store/todo.boxes';

export const Filter = memo(() => {
  const dispatch = useDispatch();
  const status = useSelector(todoStatusFilterBox);
  const [input, setInput] = useState('');
  return (
    <div>
      <div>
        <input placeholder="What to do?" value={input} onChange={(e) => setInput(e.target.value)} />{' '}
        <button disabled={!input.trim()} onClick={() => dispatch(addTodo(input.trim()))}>
          Add
        </button>
      </div>
      <div>
        <span>Filter: </span>
        {[TodoStatusFilter.All, TodoStatusFilter.New, TodoStatusFilter.Completed].map((s) => (
          <input
            type="radio"
            name="todo_status"
            value={s}
            checked={s === status}
            onChange={() => dispatch(todoStatusFilterBox.setState(s))}
            key={s}
          />
        ))}
      </div>
    </div>
  );
});
