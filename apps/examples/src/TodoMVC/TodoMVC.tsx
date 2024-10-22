import { createStore, IDBStorage, withPersist } from 'amos';
import { Provider } from 'amos/react';
import React, { memo } from 'react';
import App from '../App';
import { hashCode } from './store/todo.boxes';

const store = createStore(
  { preloadedState: { 'users.currentUserId': hashCode('Amos') } },
  withPersist({ storage: new IDBStorage('todo', 'todo') }),
);

export const TodoMVC = memo(() => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
});
