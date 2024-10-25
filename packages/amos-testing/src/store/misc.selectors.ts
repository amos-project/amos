/*
 * @since 2022-01-05 10:03:21
 * @author junbao <junbao@moego.pet>
 *
 * keep atomic boxes
 */

import { selector } from 'amos-core';
import { countBox } from './misc.boxes';

export const selectCount = selector((select) => select(countBox));
export const selectDoubleCount = selector((select) => select(countBox) * 2);
export const selectMultipleCount = selector((select, times: number) => select(countBox) * times);

export const selectDouble = selector((select, v: number) => v * 2);
export const selectFourfold = selector(
  (select, v: number) => {
    return select(selectDouble(v)) * 2;
  },
  {
    cache: true,
  },
);

export const selectEightTimesCount = selector(
  (select, plus: number = 0) => {
    const count = select(countBox);
    return select(selectDouble(count)) * select(selectFourfold(count)) + plus;
  },
  {
    cache: true,
  },
);
