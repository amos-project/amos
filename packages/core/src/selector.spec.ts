/*
 * @since 2020-11-04 10:58:11
 * @author acrazing <joking.young@gmail.com>
 */

import { selectCurrentUser } from 'amos-testing';
import { strictEqual } from '../../utils/src/utils';

describe('selector', () => {
  it('should create selector factory', () => {
    expect(selectCurrentUser).toBe(expect.any(Function));
    expect({ ...selectCurrentUser }).toEqual({
      $object: 'selector_factory',
      type: 'CURRENT_USER',
      cacheStrategy: false,
      equalFn: strictEqual,
    });
  });
  it('should create selector', () => {
    expect(selectCurrentUser()).toEqual({
      $object: 'selector',
      args: [],
      factory: selectCurrentUser,
    });
  });
});
