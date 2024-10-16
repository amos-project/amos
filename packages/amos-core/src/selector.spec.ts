/*
 * @since 2020-11-04 10:58:11
 * @author acrazing <joking.young@gmail.com>
 */

import { selectUser } from 'amos-testing';
import { $amos } from './types';

describe('selector', () => {
  it('should create selector factory', () => {
    expect(selectUser).toBe(expect.any(Function));
  });
  it('should create selector', () => {
    expect(selectUser()).toEqual(<ReturnType<typeof selectUser>>{
      [$amos]: 'SELECTOR',
      id: '',
      args: [],
      factory: selectUser,
    });
  });
});
