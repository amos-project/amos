/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import { Map } from './Map';

describe('Map', function () {
  it('should create Map', function () {
    let m1 = new Map<number, number>(0);
    m1 = m1.fromJS({ '-3': -1, '-1': 0 });
    m1 = m1.setItem(1, 2);
    m1 = m1.setAll([
      [5, 6],
      [7, 8],
    ]);
    m1 = m1.updateItem(1, (v) => v * 2);
    m1 = m1.removeItem(11);
    const m2 = m1.clear();
    expect([
      m1.size(),
      Array.from(m1.keys()).sort(),
      m1.hasItem(-1),
      m1.hasItem(11),
      m1.getItem(1),
      Array.from(m1.entries()).sort(([a], [b]) => a - b),
      m2.size(),
    ]).toEqual([
      7,
      ['-3', '-1', '1', '3', '5', '7', '9'],
      true,
      false,
      4,
      [
        [-1, '-3'],
        [0, '-1'],
        [2, '1'],
        [4, '3'],
        [6, '5'],
        [8, '7'],
        [10, '9'],
      ],
      0,
    ]);
  });
});
