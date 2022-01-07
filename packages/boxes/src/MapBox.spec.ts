/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { Map } from 'amos-shapes';
import { Morty, Rick } from 'amos-testing';
import { MapBox } from './MapBox';

describe('MapBox', function () {
  it('should create MapBox', function () {
    const newMap = new MapBox('maps.new', new Map(0, 0));
    const strMap = MapBox.str('maps.str', 0);
    const numMap = MapBox.num('maps.num', 0);

    enum MK {
      Foo,
      Bar,
    }

    const createMap = MapBox.create('maps.create', Rick, MK.Foo);
    newMap.set(0, 0);
    // @ts-expect-error
    newMap.set(1, 0);
    strMap.set('', 1);
    numMap.set(1, 2);
    // @ts-expect-error
    numMap.set('', 1);
    // @ts-expect-error
    strMap.set(1, 0);
    createMap.set(MK.Bar, Morty);
    strMap.size();
    strMap.has('1');
    strMap.get('1');
    strMap.keys();
    strMap.values();
    strMap.entities();
    createMap.map((value, key) => key);
    strMap.set('a', 1);
    strMap.setAll([
      ['a', 1],
      ['b', 2],
    ]);
    strMap.merge('a', 1);
    createMap.merge(MK.Foo, {});
    createMap.merge(MK.Foo, { firstName: Morty.firstName });
    createMap.mergeAll([
      [MK.Bar, Rick],
      [MK.Foo, { firstName: 'z' }],
    ]);
  });
});
