/*
 * @since 2020-12-03 11:42:27
 * @author acrazing <joking.young@gmail.com>
 */

import { TodoStatus } from '../../testing/src/store/todo.boxes';
import { List } from './List';
import { ListMap } from './ListMap';

describe('AmosListDict', () => {
  it('should create ListMap', () => {
    const foo = new ListMap(0, 0);
    foo.set(0, [0]);
    foo.get(0);
    foo.get(0).get(0).toExponential();
    // @ts-expect-error
    foo.get('');
    // @ts-expect-error
    foo.get(0).get(0).substr();

    const bar = new ListMap(0, TodoStatus.created);
    // @ts-expect-error
    expect(bar.get(0).get(0) === 10).toBeFalsy();

    class EList<T> extends List<T> {
      fine() {}
    }

    const l1 = new ListMap(0, TodoStatus.created, EList);
    l1.get(0)?.fine();

    class NList extends List<number> {
      fine() {}
    }

    // @ts-expect-error
    const l2 = new ListMap(0, TodoStatus.created, NList);

    // TODO: should not restrict inferValue
    const l3 = new ListMap(0, 1 as number, NList);
    l3.get(0)?.fine();
  });
});
