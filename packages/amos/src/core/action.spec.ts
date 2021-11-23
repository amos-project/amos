/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { addTwiceAsync } from 'amos-testing';
import { Action } from './action';

describe('action', () => {
  it('should create action factory', () => {
    expect(addTwiceAsync).toBeInstanceOf(Function);

    const props = { ...addTwiceAsync };
    expect(props).toEqual<typeof props>({
      $object: 'ACTION_FACTORY',
      type: 'addTwiceAsync',
      key: expect.any(Function),
      actor: expect.any(Function),
    });

    const action = addTwiceAsync(2);
    expect(action).toEqual<Action>({ $object: 'ACTION', args: [2], factory: addTwiceAsync });
  });
});
