/*
 * @since 2021-01-19 23:38:51
 * @author acrazing <joking.young@gmail.com>
 */

import { useSelector } from '@kcats/react';
import React, { memo } from 'react';
import { selectCount, selectDoubleCount } from './selector';

export const TestCount = memo(() => {
  const [count, count2] = useSelector(selectCount, selectDoubleCount);
  return <div>{count + '-' + count2}</div>;
});
