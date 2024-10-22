/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { useSelector } from 'amos/react';
import React, { memo } from 'react';
import { Filter } from './components/Filter';
import { Header } from './components/Header';
import { SignIn } from './components/SignIn';
import { TodoList } from './components/TodoList';
import { currentUserIdBox } from './store/user.boxes';

export const App = memo(() => {
  const [userId] = useSelector(currentUserIdBox);
  if (!userId) {
    return <SignIn />;
  }
  return (
    <div>
      <Header />
      <Filter />
      <TodoList />
    </div>
  );
});
