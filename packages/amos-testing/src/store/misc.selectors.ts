/*
 * @since 2022-01-05 10:03:21
 * @author junbao <junbao@moego.pet>
 *
 * keep atomic boxes
 */

import { selector } from 'amos-core';
import { countBox } from 'amos-testing';

export const selectCount = selector((select) => select(countBox));
export const selectDoubleCount = selector((select) => select(countBox) * 2);
export const selectMultipleCount = selector((select, times: number) => select(countBox) * times);
