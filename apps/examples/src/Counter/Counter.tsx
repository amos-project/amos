import { numberBox } from 'amos';
import { useDispatch, useSelector } from 'amos-react';
import React from 'react';

const countBox = numberBox('count', 0);

export const Counter = () => {
  const dispatch = useDispatch();
  const [count] = useSelector(countBox);
  return (
    <div>
      <span>Count: {count}&nbsp;</span>
      <button onClick={() => dispatch(countBox.setState((c) => c + 1))}>Click me!</button>
    </div>
  );
};
