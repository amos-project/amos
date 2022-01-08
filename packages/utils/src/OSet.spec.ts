/*
 * @since 2022-01-08 11:27:16
 * @author junbao <junbao@moego.pet>
 */

import { OSet } from './OSet';

describe('OSet', function () {
  it('should create OSet', function () {
    const set = new OSet<number>([1]);
    expect([
      set.size(),
      set.keys(),
      set.hasItem(1),
      set.hasItem(2),
      set.getItem(1),
      set.getItem(2),
      set.setItem(2),
      set.hasItem(2),
      set.removeItem(1),
      set.hasItem(1),
      set.keys(),
      set.clear(),
      set.size(),
    ]).toEqual([1, ['1'], true, false, 1, void 0, set, true, set, false, ['2'], set, 0]);
    expect(() => set.mergeItem(1)).toThrow('The operation is not supported');
  });
});
