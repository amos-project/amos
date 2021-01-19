/*
 * @since 2020-11-15 15:43:49
 * @author acrazing <joking.young@gmail.com>
 */

import {
  action,
  Box,
  createStore as createKcatsStore,
  identity,
  Select,
  selector,
  signal,
  useSelector,
} from '@kcats/core';
import { Provider as KcatsProvider } from '@kcats/react';
import { combineReducers, createSlice } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore as createReduxStore, Store as ReduxStore } from 'redux';
import { withRedux } from './withRedux';
import fn = jest.fn;
import Mock = jest.Mock;

const reduxCount = createSlice({
  name: 'redux_count',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
  },
});

const reduxUser = createSlice({
  name: 'redux_user',
  initialState: '',
  reducers: {
    update: (state, action: { payload: string }) => action.payload,
  },
});

const reduxInitialReducer = combineReducers({
  [reduxCount.name]: reduxCount.reducer,
});

const reduxNextReducer = combineReducers({
  [reduxCount.name]: reduxCount.reducer,
  [reduxUser.name]: reduxUser.reducer,
});

type RootState = ReturnType<typeof reduxNextReducer>;

const selectReduxCount = (state: RootState) => state.redux_count;
const selectReduxUser = (state: RootState) => state.redux_user;

const kcatsCountBox = new Box('kcats_count', 0, identity);

const kcatsIncrement = kcatsCountBox.mutation((state) => state + 1);

const selectKcatsCount = selector((select) => select(kcatsCountBox));

const selectCountSum = selector((select) => selectKcatsCount(select) + select(selectReduxCount));

const expectCalled = (fn: Mock, called: boolean) => {
  expect(fn).toBeCalledTimes(+called);
  fn.mockClear();
};

describe('withRedux', () => {
  it('should works', () => {
    const reduxStore: ReduxStore = createReduxStore(reduxInitialReducer);
    const kcatsStore = createKcatsStore(void 0, withRedux(reduxStore));
    kcatsStore.dispatch(kcatsIncrement());
    expect(kcatsStore.select(selectKcatsCount)).toBe(1);
    expect(selectReduxCount(reduxStore.getState())).toBe(0);
    expect(kcatsStore.select(selectReduxCount)).toBe(0);
    const action = kcatsStore.dispatch(reduxCount.actions.increment());
    expect(action.type).toBe('redux_count/increment');
    expect(selectReduxCount(reduxStore.getState())).toBe(1);
    expect(kcatsStore.select(selectReduxCount)).toBe(1);
    reduxStore.replaceReducer(
      combineReducers({
        [reduxCount.name]: reduxCount.reducer,
        [reduxUser.name]: reduxUser.reducer,
      }) as any,
    );
    expect(kcatsStore.select(selectReduxUser)).toBe('');
    expect(kcatsStore.snapshot()).toEqual({
      kcats_count: 1,
      redux_count_from_redux$: 1,
      redux_user_from_redux$: '',
    });
  });
  it('should works with hooks', () => {
    const reduxStore = createReduxStore(reduxInitialReducer);
    const kcatsStore = createKcatsStore(void 0, withRedux(reduxStore));
    const inlineCount = fn((select: Select) => select(kcatsCountBox));
    const { result } = renderHook(
      () => useSelector(selectKcatsCount, selectReduxCount, inlineCount, selectCountSum),
      {
        wrapper: (props) => (
          <ReduxProvider store={reduxStore}>
            <KcatsProvider store={kcatsStore}>{props.children}</KcatsProvider>
          </ReduxProvider>
        ),
      },
    );
    expect(result.current).toEqual([0, 0, 0, 0]);
    expectCalled(inlineCount, true);
    const [c0, c1, c2, c3] = result.current;
    expect(c0.toExponential).toBeDefined();
    expect(c1.toExponential).toBeDefined();
    expect(c2.toExponential).toBeDefined();
    expect(c3.toExponential).toBeDefined();
    // @ts-expect-error
    expect(c0.name).toBeUndefined();
    // @ts-expect-error
    expect(c1.name).toBeUndefined();
    // @ts-expect-error
    expect(c2.name).toBeUndefined();
    // @ts-expect-error
    expect(c3.name).toBeUndefined();
    act(() => {
      kcatsStore.dispatch(kcatsIncrement());
    });
    expect(result.current).toEqual([1, 0, 1, 1]);
    expectCalled(inlineCount, true);
    act(() => {
      kcatsStore.dispatch(reduxCount.actions.increment());
    });
    expect(result.current).toEqual([1, 1, 1, 2]);
    expectCalled(inlineCount, false);
  });

  it('should keep kcats types', () => {
    const store = createKcatsStore(void 0, withRedux(createReduxStore(reduxInitialReducer)));
    const r1 = store.dispatch({ type: 'REDUX_ACTION' });
    // @ts-expect-error
    expect(r1 === 1);
    expect(r1.type === 'REDUX_ACTION').toBe(true);
    const r2 = store.dispatch(action(() => 1)());
    // @ts-expect-error
    expect(r2.type === 'string');
    expect(r2 === 1).toBe(true);
    const r3 = store.dispatch(signal<number>('test')(1));
    // @ts-expect-error
    expect(r3.type === 'string');
    expect(r3 === 1).toBe(true);
    const r4 = store.dispatch(kcatsCountBox.mutation((s, k: number) => k)(10));
    // @ts-expect-error
    expect(r4.object === 'mutation');
    expect(r4 === 10).toBe(true);
  });

  it('should sync state when get snapshot', () => {
    const redux = createReduxStore(reduxInitialReducer);
    const listener = fn(() => ({ ...store.snapshot() }));
    redux.subscribe(listener);
    const store = createKcatsStore(void 0, withRedux(redux));
    redux.dispatch(reduxCount.actions.increment());
    expect(listener).toHaveReturnedWith({ redux_count_from_redux$: 1 });
  });
});
