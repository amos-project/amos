/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { addFourfoldAsync, addTwiceAsync } from 'amos-testing';
import { $amos } from 'amos-utils';
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
    const a1 = addFourfoldAsync(1);
    const a2 = addFourfoldAsync(2);
    expect(a2).toEqual<Action>({
      [$amos]: 'action',
      id: a2.id,
      key: a1.key,
      type: 'amos/addFourfoldAsync',
      conflictPolicy: 'always',
      conflictKey: void 0,
      args: [2],
      actor: expect.any(Function),
    });
    const store = createStore();
    expect(a2.actor(store.dispatch, store.select)).toBeInstanceOf(Promise);
    expect(await a2.actor(store.dispatch, store.select)).toEqual(8);
  });
});
