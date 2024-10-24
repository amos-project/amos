/*
 * @since 2022-01-06 17:19:08
 * @author junbao <junbao@moego.pet>
 */

import { JSONSerializable, JSONState } from './json';
import { ANY } from './misc';

describe('JSONSerializable', function () {
  it('should derive JSONState', function () {
    class Foo {
      toJSON(): {
        foo: number;
        bar: () => void;
      } {
        return ANY;
      }
    }

    interface BarJson {
      foo: Foo;
    }

    class Bar implements JSONSerializable<BarJson> {
      toJSON(): {
        foo: Foo;
      } {
        return ANY;
      }

      fromJS(state: JSONState<BarJson>): this {
        return this;
      }
    }

    const s1: JSONState<Bar> = {
      foo: {
        foo: 1,
        bar: null,
      },
    };

    const s2: JSONState<any> = {};

    expect([s1, s2]).toBeDefined();
  });
});
