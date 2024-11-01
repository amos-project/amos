/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { hydrate } from 'amos';
import { useQuery, useSelector } from 'amos/react';
import { memo } from 'react';
import { Filter } from './components/Filter';
import { Header } from './components/Header';
import { SignIn } from './components/SignIn';
import { TodoList } from './components/TodoList';
import { currentUserIdBox } from './store/user.boxes';

export const App = memo(() => {
  const userId = useSelector(currentUserIdBox);
  const [, gate] = useQuery(hydrate([currentUserIdBox]));
  if (gate.isPending()) {
    return <div>Loading...</div>;
  }
  if (!userId) {
    return <SignIn />;
  }
  return (
    <div className="app">
      <Header />
      <Filter />
      <TodoList />
    </div>
  );
});
