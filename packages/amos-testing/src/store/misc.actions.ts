/*
 * @since 2022-01-05 10:03:21
 * @author junbao <junbao@moego.pet>
 *
 * keep atomic boxes
 */

import { action } from 'amos-core';
import { countBox, sleep } from 'amos-testing';

export const addTwiceAsync = action(async (dispatch, select, value: number) => {
  await sleep(1);
  dispatch(countBox.add(value));
  dispatch(countBox.add(value));
});
