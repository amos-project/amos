/*
 * @since 2020-11-04 12:43:20
 * @author acrazing <joking.young@gmail.com>
 */

import { renderHook } from '@testing-library/react-hooks';
import React, { FC, memo } from 'react';
import { addGreet } from './action.spec';
import { useDispatch, useSelector, useStore } from './hooks';
import { Provider } from './provider';
import { selectCount, selectCount2 } from './selector.spec';
import { createStore } from './store';

export const TestCount = memo(() => {
  const [count, count2] = useSelector(selectCount(), selectCount2());
  return <div>{count + '-' + count2}</div>;
});

describe('useStore & useDispatch', () => {
  const store = createStore();
  const wrapper: FC = (props) => <Provider store={store}>{props.children}</Provider>;
  it('should use store & dispatch', async () => {
    const renderStore = renderHook(() => useStore(), { wrapper });
    expect(renderStore.result.current).toBe(store);
    const renderDispatch = renderHook(() => useDispatch(), { wrapper });
    expect(renderDispatch.result.current).toBe(store.dispatch);
    const renderEmpty = renderHook(() => useStore());
    expect(renderEmpty.result.error).toBeInstanceOf(Error);
  });
});

describe('useSelector', () => {
  const store = createStore();
  const wrapper: FC = (props) => <Provider store={store}>{props.children}</Provider>;
  it('select state', async () => {
    const result = renderHook(() => useSelector(selectCount(), selectCount2()), { wrapper });
    expect(result.result.current).toEqual([0, 0]);
    store.dispatch(addGreet('hello'));
    await result.waitForNextUpdate();
    expect(result.result.current).toEqual([1, 1]);
  });
});
