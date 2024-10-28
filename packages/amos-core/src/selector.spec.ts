/*
 * @since 2020-11-04 10:58:11
 * @author acrazing <joking.young@gmail.com>
 */

import { select, selectDouble, selectFourfold, selectUser } from 'amos-testing';
import { $amos, createAmosObject, is } from 'amos-utils';
import { Selector } from './selector';

describe('selector', () => {
  it('should create selector factory', () => {
    expect(selectUser).toEqual(expect.any(Function));
    expect({ ...selectUser }).toEqual({
      [$amos]: 'selector_factory',
      id: expect.any(String),
      type: 'amos/selectUser',
    });
  });
  it('should create selector', () => {
    const s = selectDouble(3);
    expect(s).toEqual(
      createAmosObject<Selector>('selector', {
        compute: expect.any(Function),
        type: 'amos/selectDouble',
        equal: is,
        args: [3],
        id: expect.any(String),
      }),
    );
    expect(s.compute(select)).toEqual(6);
    expect(selectFourfold(3).compute(select)).toEqual(12);
    expect(s.id).toEqual(selectDouble(4).id);
    expect(selectFourfold(1).id).not.toEqual(s.id);
  });
});
