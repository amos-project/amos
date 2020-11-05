/*
 * @since 2020-11-04 10:58:11
 * @author acrazing <joking.young@gmail.com>
 */

import { Test } from './box.spec';
import { selector } from './selector';

export const selectCount = selector(Test, (store, state) => state.count);
export const selectCount2 = selector((store) => store.pick(Test).count);
export const selectLatestGreets = selector(
  Test,
  (store, state, limit: number = state.greets.length) => state.greets.slice(-limit),
  (store, state, limit) => [state.greets, limit],
);

describe('selector', () => {
  it('should create selector', () => {
    expect(selectCount.deps).toEqual([Test]);
    expect(selectCount2.deps).toEqual([]);
    expect(selectLatestGreets.selector).toBeDefined();
    expect(selectLatestGreets.cacheKey).toBeDefined();
    expect(selectCount2.cacheKey).toBeUndefined();
    expect(typeof selectLatestGreets).toBe('function');
  });
});
