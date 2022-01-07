/*
 * @since 2020-11-28 11:48:05
 * @author acrazing <joking.young@gmail.com>
 */

import { falsy, identity, noop, truly } from 'amos-utils';
import { List } from './List';

describe('AmosList', () => {
  it('should create list', () => {
    expect(new List().isValid()).toBeFalsy();
    let list = new List([0, 1]);
    expect(list.isValid()).toBeTruthy();
    expect(list.fromJSON([1, 2]).data).toEqual([1, 2]);
    expect(list.toJSON()).toEqual([0, 1]);
    expect(list.size()).toEqual(2);
    expect(list.concat([2, 3]).data).toEqual([0, 1, 2, 3]);
    expect(list.copyWithin(0, 1, 2).data).toEqual([1, 1]);
    expect(list.every((v) => v > 2)).toEqual(false);
    expect(list.fill(1).data).toEqual([1, 1]);
    expect(list.filter((v) => v > 0)).toEqual([1]);
    expect(list.filterThis((v) => v > 0).data).toEqual([1]);
    expect(list.find((v) => v === 1)).toEqual(1);
    expect(list.findIndex((v) => v === 1)).toEqual(1);
    expect(
      new List([
        [0, 1],
        [2, 3],
      ]).flat(),
    ).toEqual([0, 1, 2, 3]);
    list.forEach(truly);
    list.size();
    list.concat([2]);
    list.every(truly);
    list.filter(falsy);
    list.find(truly);
    list.findIndex(truly);
    list.forEach(noop);
    list.includes(3);
    list.indexOf(4);
    list.join(',');
    list.lastIndexOf(5);
    list.map(identity);
    list.mapThis(identity);
    list.pop();
    list.push(6);
    list.reduce(identity, 7);
    list.reduceRight(identity, 8);
    list.reverse();
    list.shift();
    list.slice();
    list.some(truly);
    list.sort();
    list.splice(9, 1);
    list.unshift(10);
    list.set(10, 11);
    list.delete(12);
  });
});
