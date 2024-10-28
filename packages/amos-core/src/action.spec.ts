/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { addFourfoldAsync, addTwiceAsync } from 'amos-testing';
import { $amos, createAmosObject } from 'amos-utils';
import { Action } from './action';
import { createStore } from './store';

describe('action', () => {
  it('should create action factory', () => {
    expect(addTwiceAsync).toBeInstanceOf(Function);
    expect({ ...addTwiceAsync }).toEqual({
      [$amos]: 'action_factory',
      id: expect.any(String),
      select: expect.any(Function),
      type: 'amos/addTwiceAsync',
    });
  });
  it('should create action', async () => {
    const a0 = addFourfoldAsync(1);
    const action = addFourfoldAsync(2);
    expect(action).toEqual<Action>(
      createAmosObject<Action>('action', {
        id: a0.id,
        type: 'amos/addFourfoldAsync',
        conflictPolicy: 'always',
        conflictKey: void 0,
        args: [2],
        actor: expect.any(Function),
      }),
    );
    const store = createStore();
    expect(action.actor(store.dispatch, store.select)).toBeInstanceOf(Promise);
    expect(await action.actor(store.dispatch, store.select)).toEqual(8);
  });
});
