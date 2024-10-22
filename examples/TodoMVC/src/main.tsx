import { createStore } from 'amos-core';
import { IDBStorage, withPersist } from 'amos-persist';
import { Provider } from 'amos/react';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { hashCode } from './store/todo.boxes';

const store = createStore(
  { preloadedState: { 'users.currentUserId': hashCode('Amos') } },
  withPersist({ storage: new IDBStorage('todo', 'todo') }),
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
