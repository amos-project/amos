import { createStore, hashCode, IDBStorage } from 'amos';
import { withPersist } from 'amos-persist';
import { Provider } from 'amos-react';
import React, { memo } from 'react';
import App from '../App';

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
