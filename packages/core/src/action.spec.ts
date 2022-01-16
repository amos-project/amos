/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { addPost } from 'amos-testing';
import { Action } from './action';

describe('action', () => {
  it('should create action factory', () => {
    const props = { ...addPost };
    expect(props).toEqual<typeof props>({
      $amos: 'ACTION_FACTORY',
      type: 'addTwiceAsync',
      key: expect.any(Function),
      actor: expect.any(Function),
    });

    const action = addPost({ title: 'Hello world!', content: 'First article.' });
    expect(action).toEqual<Action>({
      $amos: 'ACTION',
      args: [{ title: 'Hello world!', content: 'First article.' }],
      factory: addPost,
    });
  });
});
