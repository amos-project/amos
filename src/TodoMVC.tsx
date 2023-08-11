import React, { useState } from 'react';
import { Box, createStore, Provider, useDispatch, useSelector, identity } from 'amos';

type Todo = {
  text: string;
  completed: boolean;
};

const todosBox = new Box<Todo[]>('todos', [], identity);

const addTodo = todosBox.mutation((state, text: string) => [...state, { text, completed: false }]);
const deleteTodo = todosBox.mutation((state, index: number) => state.filter((_, i) => i !== index));
const completeTodo = todosBox.mutation((state, index: number) => state.map((todo, i) => i === index ? { ...todo, completed: !todo.completed } : todo));

const TodoMVC: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector(todosBox);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    dispatch(addTodo(newTodo));
    setNewTodo('');
  };

  return (
    <div>
      <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            <input type="checkbox" checked={todo.completed} onChange={() => dispatch(completeTodo(index))} />
            {todo.text}
            <button onClick={() => dispatch(deleteTodo(index))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoMVC;