/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import { Map } from './Map';

describe('Map', function () {
  it('should create Map', function () {
    let m1 = new Map<number, number>(0);
    m1 = m1.fromJS({ '-3': -1, '-1': 0 });
    m1 = m1.set(1, 2);
    m1 = m1.mergeItem(3, 4);
    m1 = m1.setAll([
      [5, 6],
      [7, 8],
    ]);
    m1 = m1.merge([
      [9, 10],
      [11, 12],
    ]);
    m1 = m1.updateItem(1, (v) => v * 2);
    m1 = m1.delete(11);
    const m2 = m1.clear();
    expect([
      m1.size(),
      Array.from(m1.keys()).sort(),
      m1.has(-1),
      m1.has(11),
      m1.get(1),
      m1.map((value, key, index) => [value, key, index] as const).sort(([a], [b]) => a - b),
      m2.size(),
    ]).toEqual([
      7,
      ['-3', '-1', '1', '3', '5', '7', '9'],
      true,
      false,
      4,
      [
        [-1, '-3', 0],
        [0, '-1', 1],
        [2, '1', 2],
        [4, '3', 3],
        [6, '5', 4],
        [8, '7', 5],
        [10, '9', 6],
      ],
      0,
    ]);
  });
});
