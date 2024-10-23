/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { useDispatch } from 'amos/react';
import { memo, useState } from 'react';
import { signIn } from '../store/user.actions';

export const SignIn = memo(() => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  return (
    <div>
      <input placeholder="Your name" value={input} onChange={(e) => setInput(e.target.value)} />{' '}
      <button disabled={!input.trim()} onClick={() => dispatch(signIn(input))}>
        Sign In
      </button>
    </div>
  );
});
