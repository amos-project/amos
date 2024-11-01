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
  const handleAdd = () => {
    const title = input.trim();
    if (!title) {
      return;
    }
    dispatch(addTodo(title));
  };
  return (
    <div className="filter">
      <div className="filter-input">
        <input
          placeholder="What to do?"
          value={input}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd();
            }
          }}
          onChange={(e) => setInput(e.target.value)}
        />{' '}
        <button disabled={!input.trim()} onClick={handleAdd}>
          Add
        </button>
      </div>
      <div>
        <span>Filter: </span>
        {[TodoStatusFilter.All, TodoStatusFilter.New, TodoStatusFilter.Completed].map((s) => (
          <label key={s}>
            <input
              type="radio"
              name="todo_status"
              value={s}
              checked={s === status}
              onChange={() => dispatch(todoStatusFilterBox.setState(s))}
            />
            <span>{s}</span>
          </label>
        ))}
      </div>
    </div>
  );
});
