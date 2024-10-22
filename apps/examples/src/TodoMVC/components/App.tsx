/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { useSelector } from 'amos/react';
import React, { memo } from 'react';
import { currentUserIdBox } from '../store/user.boxes';
import { Filter } from './Filter';
import { Header } from './Header';
import { SignIn } from './SignIn';
import { TodoList } from './TodoList';

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
