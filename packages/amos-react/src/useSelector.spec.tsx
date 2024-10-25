/*
 * @since 2020-11-04 12:43:20
 * @author acrazing <joking.young@gmail.com>
 */

import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks';
import {
  createStore,
  MapSelectables,
  Select,
  Selectable,
  selector,
  Snapshot,
  Store,
} from 'amos-core';
import {
  addTwiceAsync,
  countBox,
  exampleBox,
  selectCount,
  selectDoubleCount,
  selectMultipleCount,
} from 'amos-testing';
import { FC } from 'react';
import { Provider, useDispatch, useStore } from './context';
import { useSelector } from './useSelector';
import fn = jest.fn;

describe('useStore & useDispatch', () => {
  const store = createStore();
  const wrapper: FC = (props: any) => <Provider store={store}>{props.children}</Provider>;
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
): RenderHookResult<P, MapSelectables<Rs>> & Store {
  const store = createStore({ preloadedState: preloaded });
  const hook = renderHook((props: P) => useSelector(fn(props)), {
    wrapper: (props: any) => <Provider store={store}>{props.children}</Provider>,
    initialProps,
  });
  return Object.assign(hook, store);
}

describe('useSelector', () => {
  it('should works fine with WebStorm', () => {
    renderHook(() => {
      useSelector(countBox);
    });
  });
  it('should select state', () => {
    const { result } = renderUseSelector(
      () => [countBox, selectCount(), selectDoubleCount(), selectMultipleCount(3)] as const,
      { count: 1, test: { greets: ['PRELOAD'], count: 1 } },
    );
    expect(result.current).toEqual([1, 1, 2, 3]);
  });
  it('should update', async () => {
    const { result, dispatch, waitForNextUpdate, rerender } = renderUseSelector(
      (props: { multiply: number }) => [selectDoubleCount(), selectMultipleCount(props.multiply)],
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
    act(async () => {
      await dispatch(countBox.add(1));
    });
    expect(result.current).toEqual([1]);
  });

  it('should respect deps', async () => {
    const compute = fn((select: Select, t: number) => {
      return select(countBox) * t;
    });
    const defaultSelector = selector(compute);
    const inlineFn = fn((select: Select) => select(countBox));
    const expectCalled = (defaultCount = 1, inlineCount = 1) => {
      expect(compute).toBeCalledTimes(defaultCount);
      compute.mockClear();
      expect(inlineFn).toBeCalledTimes(inlineCount);
      inlineFn.mockClear();
    };
    const { result, dispatch, rerender } = renderUseSelector(
      (props: { multiply: number }) =>
        [defaultSelector(props.multiply), inlineFn as any, countBox] as const,
      { count: 1 },
      { multiply: 1 },
    );
    expectCalled(1, 1);
    expect(result.current).toEqual([1, 1, 1]);
    dispatch(exampleBox.merge({ count: 1 }));
    expectCalled(1, 1);
    expect(result.current).toEqual([1, 1, 1]);
    rerender({ multiply: 2 });
    expectCalled(1, 1);
    expect(result.current).toEqual([2, 1, 1]);
    act(async () => {
      await dispatch(countBox.add(1));
    });
    expectCalled(2, 1);
    expect(result.current).toEqual([4, 2, 2]);
  });
});
