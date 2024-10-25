/*
 * @since 2020-11-04 10:58:11
 * @author acrazing <joking.young@gmail.com>
 */

import { double, fourfold, select, selectUser } from 'amos-testing';
import { createAmosObject, is } from 'amos-utils';
import { Selector, SelectorFactory } from './selector';

describe('selector', () => {
  it('should create selector factory', () => {
    expect(selectUser).toEqual(expect.any(Function));
    expect({ ...selectUser }).toEqual(
      createAmosObject<SelectorFactory>('selector_factory', {
        id: expect.any(String),
      }),
    );
  });
  it('should create selector', () => {
    const s = double(3);
    expect(s).toEqual(
      createAmosObject<Selector>('selector', {
        compute: expect.any(Function),
        type: 'amos/double',
        equal: is,
        args: [3],
        id: expect.any(String),
      }),
    );
    expect(s.compute(select)).toEqual(6);
    expect(fourfold(3).compute(select)).toEqual(12);
  });
});
