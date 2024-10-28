/*
 * @since 2020-11-28 11:48:05
 * @author acrazing <joking.young@gmail.com>
 */

import { expectCalledWith } from 'amos-testing';
import { identity, isIterableIterator, isNullable, notNullable } from 'amos-utils';
import { isSameList, List } from './List';

describe('AmosList', () => {
  it('should create list', () => {
    expect([
      new List().toJSON(),
      new List([]).toJSON(),
      new List([1]).toJSON(),
      new List([1, 2].entries()).toJSON(),
      new List().isInitial(),
      new List([]).isInitial(),
      new List([1]).isInitial(),
      new List([].entries()).isInitial(),
    ]).toEqual([
      [],
      [],
      [1],
      [
        [0, 1],
        [1, 2],
      ],
      true,
      true,
      false,
      true,
    ]);
    expect(new List().isInitial()).toBe(true);
    expect(new List(void 0, false).isInitial()).toBe(false);
    expect(new List([1]).isInitial()).toBe(false);
    expect(new List([1], true).isInitial()).toBe(true);
    const list = new List<number>().reset([0, 1]);
    expect(new List([1, 2])).not.toEqual([1, 2]);
    expect(new List([1, 2]).toJSON()).toEqual([1, 2]);
    expect(list.isInitial()).toBe(false);
    expect(list.fromJS([1, 2]).toJSON()).toEqual([1, 2]);
    expect(list.toJSON()).toEqual([0, 1]);
    expect(list.length).toEqual(2);
    expect(list.concat([2, 3]).toJSON()).toEqual([0, 1, 2, 3]);
    expect(list.copyWithin(0, 1, 2).toJSON()).toEqual([1, 1]);
    expect(list.every((v) => v > 2)).toEqual(false);
    expect(list.fill(1).toJSON()).toEqual([1, 1]);
    expect(list.filter((v) => v > 0)).toEqual(new List([1]));
    expect(list.find((v) => v === 1)).toEqual(1);
    expect(list.findIndex((v) => v === 1)).toEqual(1);
    expect(
      new List([
        [0, 1],
        [2, 3],
      ]).flat(),
    ).toEqual(new List([0, 1, 2, 3]));
    expect(
      [
        list.length,
        list.concat([2]),
        list.every(notNullable),
        list.filter(isNullable),
        list.find(notNullable),
        list.findIndex(notNullable),
        list.includes(3),
        list.indexOf(4),
        list.join(','),
        list.lastIndexOf(5),
        list.map(identity),
        list.pop(),
        list.push(6),
        list.reduce((p, c) => p + c, 7),
        list.reduceRight((p, c) => p + c, 8),
        list.reverse(),
        list.shift(),
        list.slice(1, 2),
        list.some(notNullable),
        list.reverse().sort(),
        list.splice(1, 1, 2),
        list.unshift(10),
        list.set(3, 11),
        list.delete(1),
        list.delete(2),
        list.flatMap((v) => [v, v]),
      ].map((v) => (v === list ? void 0 : v)),
    ).toEqual([
      2,
      new List([0, 1, 2]),
      true,
      new List(),
      0,
      0,
      false,
      -1,
      '0,1',
      -1,
      new List([0, 1]),
      new List([0]),
      new List([0, 1, 6]),
      8,
      9,
      new List([1, 0]),
      new List([1]),
      new List([1]),
      true,
      new List([0, 1]),
      new List([0, 2]),
      new List([10, 0, 1]),
      new List([0, 1, void 0, 11]),
      new List([0]),
      void 0,
      new List([0, 0, 1, 1]),
    ]);

    const list2 = list.reverse();
    expect([
      isIterableIterator(list2[Symbol.iterator]()),
      isIterableIterator(list2.keys()),
      isIterableIterator(list2.values()),
      isIterableIterator(list2.entries()),
      Array.from(list2),
      Array.from(list2.keys()),
      Array.from(list2.values()),
      Array.from(list2.entries()),
    ]).toEqual([
      true,
      true,
      true,
      true,
      [1, 0],
      [0, 1],
      [1, 0],
      [
        [0, 1],
        [1, 0],
      ],
    ]);

    const f1 = jest.fn();
    list2.forEach(f1);
    expectCalledWith(f1, [1, 0, list2], [0, 1, list2]);
  });
  it('should check list equal', () => {
    const l1 = new List([1, 2]);
    const l2 = new List([0, 1]);
    const l3 = new List([1, 2]);
    expect([
      isSameList(l1, l1),
      isSameList(l1, l2),
      isSameList(l1, l3),
      isSameList(l1.toJSON(), l2),
      isSameList(l1.toJSON(), l3),
      isSameList(l1, l2.toJSON()),
      isSameList(l1, l3.toJSON()),
      isSameList(l1.toJSON(), l2.toJSON()),
      isSameList(l1.toJSON(), l3.toJSON()),
    ]).toEqual([true, false, true, false, true, false, true, false, true]);
  });
});
