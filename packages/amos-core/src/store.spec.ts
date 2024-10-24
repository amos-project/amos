/*
 * @since 2024-10-24 10:25:32
 * @author junbao <junbao@moego.pet>
 */

import { loginAsync, LOGOUT, LogoutEvent, sessionIdBox, sessionMapBox } from 'amos-testing';
import { createStore, Store } from './store';

describe('store', () => {
  it('should create store', () => {
    const store = createStore();
    expect(store).toEqual<Store>({
      dispatch: store.dispatch,
      select: store.select,
      snapshot: store.snapshot,
      subscribe: store.subscribe,
    });
  });
  it('should dispatch base dispatchable', async () => {
    const store = createStore();
    // mutation
    const s1 = store.dispatch(sessionIdBox.setState(-1));
    const state = { ...store.snapshot() };
    expect(s1).toEqual(-1);
    state[sessionIdBox.key] = -1;
    expect(store.snapshot()).toEqual(state);

    // action, triggered signals
    const s2 = store.dispatch(loginAsync(1));
    expect(s2).toBeInstanceOf(Promise);
    const s3 = await s2;
    state[sessionIdBox.key] = s3;
    state[sessionMapBox.key] = sessionMapBox.initialState.mergeItem(s3, { userId: 1 });
    expect(store.snapshot()).toEqual(state);

    // signal
    const s4 = store.dispatch(LOGOUT({ userId: 1, sessionId: s3 }));
    expect(s4).toEqual<LogoutEvent>({ userId: 1, sessionId: s3 });
    state[sessionMapBox.key] = sessionMapBox.initialState;
    expect(store.snapshot()).toEqual(state);
  });
});
