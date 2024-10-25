/*
 * @since 2022-01-05 10:03:21
 * @author junbao <junbao@moego.pet>
 *
 * keep atomic boxes
 */

import { action, selector } from 'amos-core';
import { sleep } from '../utils';
import { countBox } from './misc.boxes';

export const addTwiceAsync = action(async (dispatch, select, value: number) => {
  await sleep(1);
  dispatch(countBox.add(value));
  dispatch(countBox.add(value));
});

export const double = selector((select, v: number) => v * 2);
export const fourfold = selector((select, v: number) => select(double(v)) * 2);
