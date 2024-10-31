/*
 * @since 2020-11-04 10:58:11
 * @author acrazing <joking.young@gmail.com>
 */

import { select, selectDouble, selectFourfold, selectUser } from 'amos-testing';
import { is } from 'amos-utils';

describe('selector', () => {
  it('should create selector factory', () => {
    expect(selectUser).toEqual(expect.any(Function));
    expect({ ...selectUser }).toEqual({
      type: 'amos/selectUser',
    });
  });
  it('should create selector', () => {
    const s = selectDouble(3);
    expect(s).toEqual({
      type: 'amos/selectDouble',
      compute: expect.any(Function),
      equal: is,
      args: [3],
    });
    expect(s.compute(select)).toEqual(6);
    expect(selectFourfold(3).compute(select)).toEqual(12);
    expect(s.id).toEqual(selectDouble(4).id);
    expect(selectFourfold(1).id).not.toEqual(s.id);
  });
});
