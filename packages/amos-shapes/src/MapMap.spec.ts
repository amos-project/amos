/*
 * @since 2024-11-14 22:38:52
 * @author junbao <junbao@moego.pet>
 */

import { TodoStatus } from 'amos-testing';
import { Map } from './Map';
import { MapMap } from './MapMap';

describe('MapMap', () => {
  it('should create MapMap', () => {
    // default list map
    const foo = new MapMap<number, Map<string, number>>(new Map(0));
    // @ts-expect-error
    foo.getItem('');
    foo.setItemIn(1, '', 1);
    foo.setItem(0, { '': 1 });
    foo.getItem(0);
    foo.getItem(0).getItem('').toExponential();
    foo.getItemIn(1, '');
    foo.hasItemIn(1, '');
    // with value type limit
    const bar = new MapMap<number, Map<TodoStatus, string>>(new Map(''));
    // @ts-expect-error
    expect(bar.getItem(0).getItem(0) === '10').toBeFalsy();

    class EMap<T> extends Map<number, T> {
      fine() {
        return this.size() > 1;
      }
    }

    expect(
      new EMap(TodoStatus.created)
        .setAll([
          [1, 1],
          [2, 2],
        ])
        .size(),
    ).toBe(2);

    const l1 = new MapMap<number, EMap<TodoStatus>>(new EMap(TodoStatus.created));
    expect(l1.getItem(0).fine()).toBe(false);
    expect(
      l1
        .setAllIn(1, [
          [1, 1],
          [2, 2],
        ])
        .getItem(1)
        .fine(),
    ).toBe(true);
  });
});
