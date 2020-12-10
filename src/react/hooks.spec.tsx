/*
 * @since 2020-11-04 12:43:20
 * @author acrazing <joking.young@gmail.com>
 */

import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks';
import React, { FC, memo } from 'react';
import { addTwiceAsync } from '../core/action.spec';
import { countBox, incrCount, mergeUser } from '../core/box.spec';
import { selector } from '../core/selector';
import { selectCount, selectDoubleCount, selectMultipleCount } from '../core/selector.spec';
import { createStore, Select, Selectable, Snapshot, Store } from '../core/store';
import { Provider } from './context';
import { MapSelector, useDispatch, useSelector, useStore } from './hooks';
import fn = jest.fn;
import Mock = jest.Mock;

export const TestCount = memo(() => {
  const [count, count2] = useSelector(selectCount, selectDoubleCount);
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

function renderUseSelector<P, Rs extends readonly Selectable[]>(
  fn: (props: P) => Rs,
  preloaded?: Snapshot,
  initialProps?: P,
): RenderHookResult<P, MapSelector<Rs>> & Store {
  const store = createStore(preloaded);
  const hook = renderHook((props: P) => useSelector(...fn(props)), {
    wrapper: (props) => <Provider store={store}>{props.children}</Provider>,
    initialProps,
  });
  return Object.assign(hook, store);
}

describe('useSelector', () => {
  it('should select state', () => {
    const { result } = renderUseSelector(
      () => [countBox, selectCount, selectDoubleCount, selectMultipleCount(3)] as const,
      { count: 1, test: { greets: ['PRELOAD'], count: 1 } },
    );
    expect(result.current).toEqual([1, 1, 2, 3]);
  });
  it('should update', async () => {
    const { result, dispatch, waitForNextUpdate, rerender } = renderUseSelector(
      (props: { multiply: number }) => [selectDoubleCount, selectMultipleCount(props.multiply)],
      { count: 1 },
      { multiply: 3 },
    );
    expect(result.current).toEqual([2, 3]);
    dispatch(addTwiceAsync(1));
    await waitForNextUpdate();
    expect(result.current).toEqual([6, 9]);
    rerender({ multiply: 4 });
    expect(result.current).toEqual([6, 12]);
  });

  it('should update - box', async () => {
    const { result, dispatch } = renderUseSelector(() => [countBox] as const);
    expect(result.current).toEqual([0]);
    act(() => dispatch(incrCount()));
    expect(result.current).toEqual([1]);
  });

  it('should respect deps', async () => {
    const defaultSelector = selector(
      fn((select: Select, t: number) => {
        return select(countBox) * t;
      }),
    );
    const inlineFn = fn((select: Select) => select(countBox));
    const expectCalled = (defaultCount = 1, inlineCount = 1) => {
      expect(defaultSelector.calc).toBeCalledTimes(defaultCount);
      (defaultSelector.calc as Mock).mockClear();
      expect(inlineFn).toBeCalledTimes(inlineCount);
      inlineFn.mockClear();
    };
    const { result, dispatch, rerender } = renderUseSelector(
      (props: { multiply: number }) =>
        [defaultSelector(props.multiply), inlineFn, countBox] as const,
      { count: 1 },
      { multiply: 1 },
    );
    expectCalled(1, 1);
    expect(result.current).toEqual([1, 1, 1]);
    dispatch(mergeUser({ id: 2 }));
    expectCalled(1, 1);
    expect(result.current).toEqual([1, 1, 1]);
    rerender({ multiply: 2 });
    expectCalled(1, 1);
    expect(result.current).toEqual([2, 1, 1]);
    act(() => dispatch(incrCount()));
    expectCalled(2, 1);
    expect(result.current).toEqual([4, 2, 2]);
  });
});
