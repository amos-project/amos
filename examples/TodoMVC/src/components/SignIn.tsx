/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { hydrate } from 'amos';
import { useDispatch, useQuery, useSelector } from 'amos/react';
import { Fragment, memo, useState } from 'react';
import { signIn } from '../store/user.actions';
import { userMapBox } from '../store/user.boxes';

export const SignIn = memo(() => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  useQuery(hydrate([userMapBox]));
  const userMap = useSelector(userMapBox);
  return (
    <div className="sign-in">
      <input placeholder="Your name" value={input} onChange={(e) => setInput(e.target.value)} />
      &nbsp;
      <button disabled={!input.trim()} onClick={() => dispatch(signIn(input))}>
        Sign In
      </button>
      <br />
      {userMap.size() > 0 && (
        <div>
          <br />
          <span>Users:&nbsp;</span>
          {Array.from(userMap.values(), (u) => (
            <Fragment key={u.id}>
              <button onClick={() => dispatch(signIn(u.name))}>{u.name}</button>
              &nbsp;
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
});
