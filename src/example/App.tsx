/*
 * @since 2020-11-03 16:09:46
 * @author acrazing <joking.young@gmail.com>
 */

import React, { memo } from 'react';
import { Provider } from '../context';
import { Store } from '../store';
import { TodoMVC } from './TodoMVC';

export interface AppProps {
  store: Store;
}

export const App = memo<AppProps>(({ store }) => {
  return (
    <Provider store={store}>
      <TodoMVC />
    </Provider>
  );
});
