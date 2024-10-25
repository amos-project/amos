/*
 * @since 2022-01-08 11:37:08
 * @author junbao <junbao@moego.pet>
 */

import { clone, Cloneable } from './Clonable';

describe('Cloneable', () => {
  it('should create cloneable object', () => {
    expect([new Cloneable(true).isInitial(), new Cloneable(false).isInitial()]).toEqual([
      true,
      false,
    ]);
  });

  it('should clone object', () => {
    class Foo extends Cloneable {
      bar?: string;

      foo() {
        return this.bar;
      }
    }

    const o1 = new Foo(true);
    const o2 = new Foo(false);
    const o3 = clone(o1, { bar: 'bar' });
    const o4: Foo = clone(o2, {});
    const o5 = clone(o3, { bar: 'baz' });
    expect([
      o1.isInitial(),
      o2.isInitial(),
      o3.isInitial(),
      o4.isInitial(),
      o5.isInitial(),
      o5.hasOwnProperty('bar'),
      o5 instanceof Foo,
      o3.foo(),
      o5.foo(),
    ]).toEqual([true, false, false, false, false, true, true, 'bar', 'baz']);
  });
});
