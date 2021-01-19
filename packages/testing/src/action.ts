/*
 * @since 2021-01-19 23:31:38
 * @author acrazing <joking.young@gmail.com>
 */

import { action } from '@kcats/core';
import { addCount } from './box';

export const addTwiceAsync = action(async (dispatch, select, base: number) => {
  await Promise.resolve();
  return dispatch(addCount(base * 2));
}, 'ADD_TWICE_ASYNC');
