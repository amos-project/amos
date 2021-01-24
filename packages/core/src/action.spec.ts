/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { addTwiceAsync } from '@kcats/testing';

describe('action', () => {
  it('should create action factory', () => {
    expect({ ...addTwiceAsync }).toEqual({
      $object: 'action_factory',
      type: 'ADD_TWICE_ASYNC',
      actor: expect.any(Function),
      queryKey: expect.any(Function),
    });
  });

  it('should create action', () => {
    const action = addTwiceAsync(2);
    expect(action).toEqual({ $object: 'action', args: [2], factory: addTwiceAsync });
  });
});
