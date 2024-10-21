/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { Morty, Rick } from 'amos-testing';
import { mapBox } from './mapBox';

enum MK {
  Foo,
  Bar,
}

const newMap = mapBox('unit.mapBox.new', 0 as 0, 0);
const strMap = mapBox('unit.mapBox.str', '', 0);
const numMap = mapBox('unit.mapBox.num', 0, { foo: 'bar', bar: 1 });
const createMap = mapBox('unit.mapBox.create', MK.Foo, Rick);

describe('MapBox', function () {
  it('should create MapBox', function () {
    newMap.setItem(0, 0);
    // @ts-expect-error
    newMap.setItem(1, 0);
    strMap.setItem('', 1);
    numMap.setItem(1, { foo: 'baz', bar: 2 });
    // @ts-expect-error
    numMap.setItem('', 1);
    // @ts-expect-error
    strMap.setItem(1, 0);
    createMap.setItem(MK.Bar, Morty);
    strMap.size();
    strMap.hasItem('1');
    strMap.getItem('1');
    strMap.setItem('a', 1);
    strMap.setAll([
      ['a', 1],
      ['b', 2],
    ]);
  });
});
