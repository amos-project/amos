/*
 * @since 2020-11-04 11:16:17
 * @author acrazing <joking.young@gmail.com>
 */

import { arrayEqual, identity, is, shallowEqual } from './equals';

describe('utils', () => {
  it('should compare array shallow', () => {
    expect(arrayEqual([1], [1])).toBe(true);
    expect(arrayEqual([1], [1, 2])).toBe(false);
    expect(arrayEqual([1, 2], [1, 2])).toBe(true);
    expect(arrayEqual([1, 2], [1, 3])).toBe(false);
  });

  it('should shallow compare', () => {
    expect(shallowEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(shallowEqual({ a: 1 }, { a: 1, b: 3 })).toBe(false);
  });

  it('should identity', () => {
    expect(identity(expect)).toBe(expect);
  });

  it('should strict compare', () => {
    expect(is(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(is(NaN, NaN)).toBe(false);
    expect(is({}, {})).toBe(false);
    expect(is('abc', 'abc')).toBe(true);
  });

  it('should compare array', () => {
    expect(arrayEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(arrayEqual([1, 2, 3, 4], [1, 2, 3])).toBe(false);
    expect(arrayEqual([1, 2, {}], [1, 2, {}])).toBe(false);

    function testArgs() {
      expect(arrayEqual(arguments, arguments)).toBe(true);
    }

    testArgs();
  });
});
