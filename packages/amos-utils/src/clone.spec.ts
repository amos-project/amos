/*
 * @since 2022-01-08 11:37:08
 * @author junbao <junbao@moego.pet>
 */

import { clone, Cloneable } from './clone';

describe('clone', function () {
  it('should clone object', function () {
    class Foo extends Cloneable {
      bar?: string;

      foo() {
        return this.bar;
      }
    }

    const o1 = new Foo(true);
    const o2 = new Foo(false);
    const o3 = clone(o1, { bar: 'bar' });
    const o4 = clone(o2, {});
    const o5 = clone(o3, { bar: 'baz' });
    expect([
      o1.isValid(),
      o2.isValid(),
      o3.isValid(),
      o4.isValid(),
      o5.isValid(),
      o5.hasOwnProperty('foo'),
      o5 instanceof Foo,
      o3.foo(),
      o5.foo(),
    ]).toEqual([true, false, true, true, true, false, true, 'bar', 'baz']);
  });
});
