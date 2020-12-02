/*
 * @since 2020-11-28 11:48:05
 * @author acrazing <joking.young@gmail.com>
 */

import { identity } from '../core/utils';
import { AmosList, createListBox } from './AmosList';

describe('AmosList', () => {
  it('should create list', () => {
    const list = new AmosList<number>();
    list.toJSON();
    list.fromJSON([1]);
    list.size();
    list.concat([2]);
    list.every(identity);
    list.filter(identity);
    list.find(identity);
    list.findIndex(identity);
    list.forEach(identity);
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
    const box = createListBox('test/list', new AmosList<number>());

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
