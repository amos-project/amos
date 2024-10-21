/*
 * @since 2020-11-04 10:58:11
 * @author acrazing <joking.young@gmail.com>
 */

import { selectUser } from 'amos-testing';
import { createAmosObject, is } from 'amos-utils';
import { Selector } from './selector';

describe('selector', () => {
  it('should create selector factory', () => {
    expect(selectUser).toBe(expect.any(Function));
  });
  it('should create selector', () => {
    expect(selectUser()).toEqual(
      createAmosObject<Selector>('selector', {
        compute: expect.any(Function),
        type: '',
        equal: is,
        args: [],
        id: expect.any(String),
      }),
    );
  });
});
