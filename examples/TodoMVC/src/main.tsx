import { createStore, IDBStorage, withPersist } from 'amos';
import { Provider } from 'amos/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { hashCode } from './store/todo.boxes';
import { currentUserIdBox, userMapBox } from './store/user.boxes';

const userId = hashCode('Amos');

const store = createStore(
  {
    name: 'Amos - TodoMVC',
    devtools: true,
    preloadedState: {
      [currentUserIdBox.key]: userId,
      [userMapBox.key]: {
        [userId]: { id: userId, name: 'Amos' },
      },
    },
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
