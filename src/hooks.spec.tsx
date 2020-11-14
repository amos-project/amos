/*
 * @since 2020-11-04 12:43:20
 * @author acrazing <joking.young@gmail.com>
 */

import { renderHook } from '@testing-library/react-hooks';
import React, { FC, memo } from 'react';
import { addGreet } from './action.spec';
import { Provider } from './context';
import { useDispatch, useSelector, useStore } from './hooks';
import { selectCount, selectDoubleCount } from './selector.spec';
import { createStore } from './store';

export const TestCount = memo(() => {
  const [count, count2] = useSelector(selectCount, selectDoubleCount());
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
    const result = renderHook(() => useSelector(selectCount, selectDoubleCount()), { wrapper });
    expect(result.result.current).toEqual([0, 0]);
    store.dispatch(addGreet('hello'));
    await result.waitForNextUpdate();
    expect(result.result.current).toEqual([1, 2]);
  });
});
