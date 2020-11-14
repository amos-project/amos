/*
 * @since 2020-11-04 10:58:11
 * @author acrazing <joking.young@gmail.com>
 */

import { testBox } from './box.spec';
import { selector } from './selector';
import { Select } from './store';

export const selectCount = (select: Select) => select(testBox).count;

export const selectDoubleCount = selector(
  (select) => selectCount(select) * 2,
  (select) => [selectCount(select)],
);

export const selectMultipleCount = selector(
  (select, multiply: number) => selectCount(select) * multiply,
  (select, multiply) => [selectCount(select), multiply],
);

export const selectLatestGreets = selector(
  (select, limit: number = select(testBox).greets.length) => select(testBox).greets.slice(-limit),
  (select, limit) => [select(testBox).greets, limit],
);

describe('selector', () => {
  it('should create selector', () => {
    expect(typeof selectLatestGreets).toBe('function');
  });
});
