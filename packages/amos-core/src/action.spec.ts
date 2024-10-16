/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { addPost } from 'amos-testing';
import { Action } from './action';
import { $amos } from './types';

describe('action', () => {
  it('should create action factory', () => {
    const props = { ...addPost };
    expect(props).toEqual<typeof props>({
      [$amos]: 'ACTION_FACTORY',
      id: '',
      options: {
        type: 'addTwiceAsync',
      },
      actor: expect.any(Function),
    });

    const action = addPost({ title: 'Hello world!', content: 'First article.' });
    expect(action).toEqual<Action>({
      [$amos]: 'ACTION',
      id: '',
      args: [{ title: 'Hello world!', content: 'First article.' }],
      factory: addPost,
    });
  });
});
