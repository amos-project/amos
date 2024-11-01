/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { useDispatch, useSelector } from 'amos/react';
import { memo } from 'react';
import { signOut } from '../store/user.actions';
import { selectCurrentUser } from '../store/user.selectors';

export const Header = memo(() => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser());
  if (user.isInitial()) {
    return null;
  }
  return (
    <div className="header flex">
      <span className="expand" />
      <span>Welcome,</span>
      &nbsp;
      <strong>{user.name}</strong>
      <span>.</span>
      &nbsp;
      <button onClick={() => dispatch(signOut(false))}>Sign out</button>
      &nbsp;
      <button onClick={() => dispatch(signOut(true))}>Switch user</button>
    </div>
  );
});
