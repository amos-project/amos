/*
 * @since 2022-01-08 11:21:10
 * @author junbao <junbao@moego.pet>
 */

import { LRUMap } from './LRUMap';

describe('LRUMap', function () {
  it('should create LRUMap', function () {
    const map = new LRUMap<number, number>(2);
    map.setItem(1, 2);
    map.setItem(2, 3);
    map.setItem(3, 4);
    map.setItem(4, 5);
    map.setItem(5, 6);
    expect(map.size()).toBe(4);
    expect(map.keys()).toEqual([2, 3, 4, 5]);
  });
});
