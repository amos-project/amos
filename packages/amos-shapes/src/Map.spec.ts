/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import { checkType, expectCalledWith, isIterable, isIterableIterator } from 'amos-testing';
import { identity } from 'amos-utils';
import { Map } from './Map';

describe('Map', () => {
  const m1 = new Map<number, number>(0).fromJS({ 3: -1, 2: 1 });
  const m2 = m1.fromJS({ 1: 2 });
  checkType(() => {
    // @ts-expect-error
    m1.setAll([3, 1]);
    // @ts-expect-error
    m1.setAll({ 3: [3, 1] as const });
    // @ts-expect-error
    m1.mergeAll([3, 1]);
    // @ts-expect-error
    m1.mergeAll({ 3: [3, 1] as const });
  });
  it('should not update', () => {
    expect([
      m1,
      m1.setItem(3, -1),
      m1.setAll([[3, -1]]),
      m1.setAll({ 3: -1 }),
      m1.mergeItem(3, -1),
      m1.mergeAll({ 3: -1 }),
      m1.mergeAll([[3, -1]]),
      m1.updateItem(3, identity),
      m1.updateAll(identity),
      m1.removeItem(4),
      m1.removeAll([4, 5]),
    ]).toEqual([m1, m1, m1, m1, m1, m1, m1, m1, m1, m1, m1]);
  });
  it('should update map', () => {
    const m1 = new Map<number, number>(0).fromJS({ 3: -1, 2: 1 });
    const m2 = m1.fromJS({ 1: 2 });
    expect(
      [
        m1,
        m2,
        m1.reset({ 1: 2 }),
        m1.setItem(3, 2),
        m1.setItem(4, 3),
        m1.setAll({ 3: 2, 4: 3 }),
        m1.setAll([
          [3, 2],
          [4, 3],
        ]),
        m1.mergeItem(3, 2),
        m1.mergeItem(4, 3),
        m1.mergeAll({ 3: 2, 4: 3 }),
        m1.mergeAll([
          [3, 2],
          [4, 3],
        ]),
        m1.updateItem(3, (v) => v - 1),
        m1.updateItem(4, (v) => v + 2),
        m1.updateAll((v) => v * 2),
        m1.removeItem(3),
        m1.removeItem(4),
        m1.removeAll([3, 4]),
        m1.removeAll([3, 2].values()),
        m1.clear(),
      ].map((v) => (v instanceof Map ? v.toJSON() : void 0)),
    ).toEqual([
      { 3: -1, 2: 1 },
      { 1: 2 },
      { 1: 2 },
      { 3: 2, 2: 1 },
      { 3: -1, 2: 1, 4: 3 },
      { 3: 2, 2: 1, 4: 3 },
      { 3: 2, 2: 1, 4: 3 },
      { 3: 2, 2: 1 },
      { 3: -1, 2: 1, 4: 3 },
      { 3: 2, 2: 1, 4: 3 },
      { 3: 2, 2: 1, 4: 3 },
      { 3: -2, 2: 1 },
      { 3: -1, 2: 1, 4: 2 },
      { 3: -2, 2: 2 },
      { 2: 1 },
      { 3: -1, 2: 1 },
      { 2: 1 },
      {},
      {},
    ]);
  });
  it('should select state', () => {
    expect([
      m1.size(),
      m2.size(),
      m1.hasItem(3),
      m1.hasItem(1),
      m1.getItem(3),
      m1.getItem(1),
      isIterable(m1),
      isIterableIterator(m1[Symbol.iterator]()),
      isIterableIterator(m1.entries()),
      isIterableIterator(m1.keys()),
      isIterableIterator(m1.values()),
      Array.from(m1),
      Array.from(m1.entries()),
      Array.from(m1.keys()),
      Array.from(m1.values()),
    ]).toEqual([
      2,
      1,
      true,
      false,
      -1,
      0,
      true,
      true,
      true,
      true,
      true,
      [
        ['2', 1],
        ['3', -1],
      ],
      [
        ['2', 1],
        ['3', -1],
      ],
      ['2', '3'],
      [1, -1],
    ]);
    const f1 = jest.fn();
    m1.forEach(f1);
    expectCalledWith(f1, [1, '2', 0], [-1, '3', 1]);
  });
});
