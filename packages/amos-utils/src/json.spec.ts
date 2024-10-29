/*
 * @since 2022-01-06 17:19:08
 * @author junbao <junbao@moego.pet>
 */

import { Morty, Rick, UserRecord } from 'amos-testing';
import {
  fromJS,
  isFromJS,
  isJSONSerializable,
  isToJSON,
  JSONSerializable,
  JSONState,
  toJS,
} from './json';
import { ANY } from './misc';

describe('JSONSerializable', () => {
  it('should derive JSONState', () => {
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

    expect([
      isFromJS(new Foo()),
      isFromJS(new Bar()),
      isToJSON(new Foo()),
      isToJSON({}),
      isJSONSerializable(new Foo()),
      isJSONSerializable(new Bar()),
      isJSONSerializable({}),
    ]).toEqual([false, true, true, false, false, true, false]);
    expect(
      toJS({
        a: 1,
        b: new Date(2020, 0, 1),
        c: [1, new Foo()],
        d: new Bar(),
        bar: {
          bar: new Bar(),
        },
      }),
    ).toEqual({
      a: 1,
      b: new Date(2020, 0, 1).toJSON(),
      c: [1, void 0],
      d: void 0,
      bar: { bar: void 0 },
    });
    expect(
      fromJS(
        {
          a: Rick,
          b: [1, 2],
          c: 1,
          e: [2, 3],
          f: {},
          g: { h: Morty },
        },
        {
          a: { firstName: 'F1' },
          b: [3, 4],
          c: 2,
          e: 1,
          f: [3],
          g: { h: { firstName: 'F2' } },
        },
      ),
    ).toEqual({
      a: UserRecord.defaultInstance().set('firstName', 'F1'),
      b: [3, 4],
      c: 2,
      e: 1,
      f: [3],
      g: { h: UserRecord.defaultInstance().set('firstName', 'F2') },
    });
  });
});
