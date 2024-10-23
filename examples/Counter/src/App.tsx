/*
 * @since 2024-10-18 23:41:18
 * @author junbao <junbao@moego.pet>
 */

import { numberBox } from 'amos';
import { useDispatch, useSelector } from 'amos/react';
import { memo } from 'react';

const countBox = numberBox('count', 0);

export const App = memo(() => {
  const dispatch = useDispatch();
  const count = useSelector(countBox);
  return (
    <div>
      <span>Count: {count}&nbsp;</span>
      <button onClick={() => dispatch(countBox.setState((c) => c + 1))}>Click me!</button>
    </div>
  );
});
