/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { useDispatch, useSelector } from 'amos/react';
import React, { memo } from 'react';
import { signOut } from '../store/user.actions';
import { selectCurrentUser } from '../store/user.selectors';

export const Header = memo(() => {
  const dispatch = useDispatch();
  const [user] = useSelector(selectCurrentUser());
  const handleSignOut = () => {
    const keepData = confirm('You will be signed out, do you want to keep your data?');
    dispatch(signOut(keepData));
  };
  if (!user.isValid()) {
    return null;
  }
  return (
    <div>
      <span>Welcome, {user.name}. </span>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
});
