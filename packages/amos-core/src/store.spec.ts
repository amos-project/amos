/*
 * @since 2024-10-24 10:25:32
 * @author junbao <junbao@moego.pet>
 */

import {
  addTodo,
  countBox,
  LOGIN,
  loginAsync,
  loginSync,
  LOGOUT,
  LogoutEvent,
  selectTodoList,
  sessionIdBox,
  sessionMapBox,
  todoMapBox,
} from 'amos-testing';
import { pick } from 'lodash';
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
    expect(pick(store.snapshot(), Object.keys(state))).toMatchObject(state);
  });

  it('should select base selectable', async () => {
    const { select, dispatch } = createStore();
    expect(select(sessionMapBox)).toBe(sessionMapBox.initialState);
    const id = await dispatch(addTodo({ title: 'Hello', description: 'World' }));
    expect(pick(select(todoMapBox.getItem(id)).toJSON(), ['id', 'title', 'description'])).toEqual({
      id: id,
      title: 'Hello',
      description: 'World',
    });
    expect(select(selectTodoList()).toJSON()).toEqual([id]);
  });

  it('should dispatch event', () => {
    const { select, dispatch, subscribe } = createStore();
    const f1 = jest.fn();
    const u1 = subscribe(f1);
    dispatch(loginSync(1));
    expect(f1).toHaveBeenCalledTimes(1);
    f1.mockReset();
    select(countBox);
    expect(f1).toHaveBeenCalledTimes(0);
    dispatch(loginSync(1));
    dispatch(countBox.setState());
    dispatch(LOGIN({ userId: 1, sessionId: 1 }));
    expect(f1).toHaveBeenCalledTimes(3);
    f1.mockReset();
    u1();
    dispatch(LOGOUT({ userId: 1, sessionId: 1 }));
    expect(f1).toHaveBeenCalledTimes(0);
  });
});
