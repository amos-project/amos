/*
 * @since 2020-11-28 11:48:05
 * @author acrazing <joking.young@gmail.com>
 */

import { identity } from 'amos';
import { falsy, noop, truly } from '../../utils/src/utils';
import { createListBox, List } from './List';
import { ListMap } from './ListMap';

describe('AmosList', () => {
  it('should create list', () => {
    let list = new List([0, 1]);
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
    list.some(identity);
    list.sort();
    list.splice(9);
    list.unshift(10);
    list.set(10, 11);
    list.delete(12);
  });

  it('should create list box', () => {
    const box = createListBox('test/list', new List([0]));

    box.size();
    box.concat([1]);
    box.every(identity);
    box.findIndex(identity);
    box.find(identity);
    box.findIndex(identity);
    box.includes(2);
    box.indexOf(3);
    box.join('4');
    box.lastIndexOf(5);
    box.map(identity);
    box.mapThis(identity);
    box.pop();
    box.push(6);
    box.reduce(identity, 7);
    box.reduceRight(identity, 8);
    box.reverse();
    box.shift();
    box.slice();
    box.some(identity);
    box.sort();
    box.splice(9);
    box.unshift(10);
    box.set(11, 12);
    box.delete(13);
  });
});
