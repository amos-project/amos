/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { addFourfoldAsync, addTwiceAsync } from 'amos-testing';
import { createStore } from './store';

describe('action', () => {
  it('should create action factory', () => {
    expect(addTwiceAsync).toBeInstanceOf(Function);
    expect({ ...addTwiceAsync }).toEqual({
      type: 'amos/addTwiceAsync',
      select: expect.any(Function),
    });
  });
  it('should create action', async () => {
    const a1 = addFourfoldAsync(1);
    const a2 = addFourfoldAsync(2);
    expect(a2).toEqual({
      type: 'amos/addFourfoldAsync',
      conflictPolicy: 'always',
      conflictKey: void 0,
      args: [2],
      actor: expect.any(Function),
    });
    expect(a1.id).toBe(a2.id);
    expect(a1.key).toBe(a2.key);
    const store = createStore();
    expect(a2.actor(store.dispatch, store.select)).toBeInstanceOf(Promise);
    expect(await a2.actor(store.dispatch, store.select)).toEqual(8);
  });
});
