/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { addPost } from 'amos-testing';
import { $amos } from 'amos-utils';
import { Action } from './action';

describe('action', () => {
  it('should create action factory', () => {
    const props = { ...addPost };
    expect(props).toEqual<typeof props>({
      [$amos]: 'action_factory',
      id: expect.any(String),
      select: expect.any(Function),
    });

    const action = addPost({ title: 'Hello world!', content: 'First article.' });
    expect(action).toEqual<Action>({
      [$amos]: 'action',
      id: '',
      type: '',
      conflictPolicy: 'always',
      args: [{ title: 'Hello world!', content: 'First article.' }],
      actor: expect.any(Function),
    });
  });
});
