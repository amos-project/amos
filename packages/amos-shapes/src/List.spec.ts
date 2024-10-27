/*
 * @since 2020-11-28 11:48:05
 * @author acrazing <joking.young@gmail.com>
 */

import { identity, isNullable, notNullable } from 'amos-utils';
import { List } from './List';

describe('AmosList', () => {
  it('should create list', () => {
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
    list.forEach(notNullable);
    list.length;
    list.concat([2]);
    list.every(notNullable);
    list.filter(isNullable);
    list.find(notNullable);
    list.findIndex(notNullable);
    list.forEach((v) => v);
    list.includes(3);
    list.indexOf(4);
    list.join(',');
    list.lastIndexOf(5);
    list.map(identity);
    list.pop();
    list.push(6);
    list.reduce(identity, 7);
    list.reduceRight(identity, 8);
    list.reverse();
    list.shift();
    list.slice();
    list.some(notNullable);
    list.sort();
    list.splice(9, 1);
    list.unshift(10);
    list.set(10, 11);
    list.delete(12);
  });
});
