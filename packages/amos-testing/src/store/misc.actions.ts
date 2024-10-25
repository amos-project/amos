/*
 * @since 2022-01-05 10:03:21
 * @author junbao <junbao@moego.pet>
 *
 * keep atomic boxes
 */

import { action } from 'amos-core';
import { sleep } from '../utils';
import { countBox } from './misc.boxes';

export const addTwiceAsync = action(async (dispatch, select, value: number) => {
  await sleep(1);
  dispatch(countBox.add(value));
  dispatch(countBox.add(value));
});

export const addFourfoldAsync = action(async (dispatch, select, value: number) => {
  dispatch(countBox.add(value));
  dispatch(countBox.setState((state) => state + value));
  await sleep();
  dispatch(countBox.setState(select(countBox) + value));
  dispatch(countBox.add(value));
  return value * 4;
});
