import { createStore, IDBStorage, withPersist } from 'amos';
import { Provider } from 'amos/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const store = createStore(
  {
    name: 'Amos - TodoMVC',
    devtools: true,
  },
  withPersist({
    storage: new IDBStorage('todo', 'todo'),
    includes: () => true,
  }),
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
