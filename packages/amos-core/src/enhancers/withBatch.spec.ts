/*
 * @since 2024-10-25 11:24:43
 * @author junbao <junbao@moego.pet>
 */

import { createStore } from 'amos-core';
import {
  addFourfoldAsync,
  countBox,
  loginAsync,
  LOGOUT,
  Rick,
  selectUser,
  sessionMapBox,
  SessionRecord,
} from 'amos-testing';

describe('withBatch', () => {
  it('should batch dispatch', async () => {
    const store = createStore();
    const f1 = jest.fn((...args: any[]) => [args, { ...store.snapshot() }]);
    store.subscribe(f1);
    const r1 = store.dispatch([
      countBox.setState(1),
      addFourfoldAsync(2),
      LOGOUT({ userId: 0, sessionId: 0 }),
    ]);
    expect(r1).toEqual([1, expect.any(Promise), { userId: 0, sessionId: 0 }]);
    expect(f1).toHaveBeenCalledTimes(1);
    expect(f1).toHaveLastReturnedWith([[], { ...store.snapshot() }]);
    const r2 = await Promise.all(r1);
    expect(r2[1]).toEqual(8);
    expect(f1).toHaveBeenCalledTimes(3);
  });
  it('should batch select', async () => {
    const store = createStore();
    const r1 = await Promise.all(
      store.dispatch([countBox.setState(1), addFourfoldAsync(2), loginAsync(1)]),
    );
    const r2 = store.select([countBox, sessionMapBox.getItem(r1[2]), selectUser(1)]);
    expect(r2).toEqual([9, new SessionRecord({ id: r1[2], userId: 1 }), Rick]);
  });
});
