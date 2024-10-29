/*
 * @since 2022-01-08 11:37:27
 * @author junbao <junbao@moego.pet>
 */

import {
  arrayEqual,
  is,
  isArray,
  isIterable,
  isIterableIterator,
  isIterator,
  isNullable,
  isObject,
  isPlainObject,
  isTruly,
  notNullable,
  shallowEqual,
  takeFirst,
  takeSecond,
} from './equals';

describe('equals', () => {
  it('is', () => {
    expect(is(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(is(NaN, NaN)).toBe(true);
    expect(is({}, {})).toBe(false);
    expect(is('abc', 'abc')).toBe(true);
  });

  it('take arguments', () => {
    expect(takeFirst(1)).toBe(1);
    expect(takeFirst(2)).toBe(2);
    expect(takeSecond(1, 2)).toBe(2);
    expect(takeSecond(2, 3)).toBe(3);
    expect([0, 1, 2].map(takeFirst)).toEqual([0, 1, 2]);
    expect([0, 1, 2].filter(takeFirst)).toEqual([1, 2]);
  });

  it('should check falsy', () => {
    expect([1, null, void 0, '', 0, NaN, ' '].map(isNullable)).toEqual([
      false,
      true,
      true,
      false,
      false,
      false,
      false,
    ]);
    expect([1, null, void 0, '', 0, NaN, ' '].map(notNullable)).toEqual([
      true,
      false,
      false,
      true,
      true,
      true,
      true,
    ]);
    expect([1, null, void 0, '', 0, NaN, ' '].map(isTruly)).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
      true,
    ]);
  });

  it('should shallow compare', () => {
    expect(shallowEqual(1, 1)).toBe(true);
    expect(shallowEqual(1, 2)).toBe(false);
    expect(shallowEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(shallowEqual({ a: 1 }, { a: 1, b: 3 })).toBe(false);
  });

  it('should compare array', () => {
    expect(arrayEqual([1], [1])).toBe(true);
    expect(arrayEqual([1], [1, 2])).toBe(false);
    expect(arrayEqual([1, 2], [1, 2])).toBe(true);
    expect(arrayEqual([1, 2], [1, 3])).toBe(false);
    expect(arrayEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(arrayEqual([1, 2, 3, 4], [1, 2, 3])).toBe(false);
    expect(arrayEqual([1, 2, {}], [1, 2, {}])).toBe(false);

    function testArgs() {
      expect(arrayEqual(arguments, arguments)).toBe(true);
    }

    testArgs();
  });

  it('should check object is', () => {
    expect(
      [1, Symbol(''), null, void 0, true, NaN, Infinity, 1n, '', Object, {}, new Date(), []].map(
        isObject,
      ),
    ).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
    ]);
    expect([1, {}, [], null].map(isArray)).toEqual([false, false, true, false]);
    expect([1, {}, [], new Date(), Object.create(null)].map(isPlainObject)).toEqual([
      false,
      true,
      false,
      false,
      true,
    ]);
    expect([1, [], [].entries(), new Map(), {}].map(isIterable)).toEqual([
      false,
      true,
      true,
      true,
      false,
    ]);
    expect([1, [], [].entries(), new Map(), {}].map(isIterator)).toEqual([
      false,
      false,
      true,
      false,
      false,
    ]);
    expect([1, [], [].entries(), new Map(), {}].map(isIterableIterator)).toEqual([
      false,
      false,
      true,
      false,
      false,
    ]);
  });
});
