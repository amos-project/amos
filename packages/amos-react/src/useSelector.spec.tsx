/*
 * @since 2020-11-04 12:43:20
 * @author acrazing <joking.young@gmail.com>
 */

import { act, renderHook, type RenderHookResult } from '@testing-library/react';
import { createStore, Select, Selectable, selector, Snapshot, Store } from 'amos-core';
import {
  addTwiceAsync,
  countBox,
  exampleBox,
  expectCalled,
  Morty,
  selectCount,
  selectDoubleCount,
  selectMultipleCount,
  sessionIdBox,
  sessionMapBox,
  userMapBox,
} from 'amos-testing';
import { arrayEqual } from 'amos-utils';
import { Provider } from './context';
import { useSelector } from './useSelector';

function renderDynamicHook<P, T>(
  fn: (props: P) => T,
  preloadedState?: Snapshot,
  initialProps?: P,
): RenderHookResult<T, P> & Store & { mockFn: jest.Mock } {
  const store = createStore({ preloadedState });
  const mockFn = jest.fn();
  const hook = renderHook(
    (props: P) => {
      mockFn(props);
      return fn(props);
    },
    {
      wrapper: (props) => <Provider store={store}>{props.children}</Provider>,
      initialProps,
    },
  );
  return Object.assign(hook, store, { mockFn: mockFn });
}

function renderUseSelector<P, Rs extends readonly Selectable[] | []>(
  fn: (props: P) => Rs,
  preloadedState?: Snapshot,
  initialProps?: P,
) {
  return renderDynamicHook((props) => useSelector(fn(props)), preloadedState, initialProps);
}

describe('useSelector', () => {
  it('should select state', () => {
    const { result } = renderUseSelector(
      () => [countBox, selectCount(), selectDoubleCount(), selectMultipleCount(3)],
      { count: 1 },
    );
    expect(result.current).toEqual([1, 1, 2, 3]);
  });
  it('should update', async () => {
    const { result, dispatch, rerender } = renderUseSelector(
      (props) => [selectDoubleCount(), selectMultipleCount(props.multiply)],
      { count: 1 },
      { multiply: 3 },
    );
    expect(result.current).toEqual([2, 3]);
    await act(async () => {
      await dispatch(addTwiceAsync(1));
    });
    expect(result.current).toEqual([6, 9]);
    rerender({ multiply: 4 });
    expect(result.current).toEqual([6, 12]);
  });

  it('should update - box', async () => {
    const { result, dispatch } = renderUseSelector(() => [countBox] as const);
    expect(result.current).toEqual([0]);
    await act(async () => {
      dispatch(countBox.add(1));
    });
    expect(result.current).toEqual([1]);
  });

  it('should render dynamic selectors', async () => {
    const { result, dispatch, rerender, mockFn } = renderDynamicHook(
      ({ multiply }) => {
        const select = useSelector();
        return [
          select,
          multiply % 2 ? select(sessionIdBox) * multiply : select(countBox) * multiply,
        ] as const;
      },
      { count: 1 },
      { multiply: 2 },
    );
    // initial
    const expectState = (mock: number, values: typeof result.current) => {
      expectCalled(mockFn, mock);
      expect(result.current).toEqual(values);
    };
    expectState(1, [expect.any(Function), 2]);

    // no update
    dispatch(sessionIdBox.setState(1));
    expectState(0, [expect.any(Function), 2]);

    // update
    await act(async () => {
      dispatch(countBox.add(1));
    });
    expectState(1, [expect.any(Function), 4]);

    // rerender
    rerender({ multiply: 3 });
    expectState(1, [expect.any(Function), 3]);

    // external
    expect(result.current[0](exampleBox.get('title'))).toEqual('');
    expectState(0, [expect.any(Function), 3]);
  });

  it('should respect deps', async () => {
    const simpleFn = jest.fn((select: Select, t: number) => {
      return select(countBox) * t;
    });
    const simpleSelector = selector(simpleFn, { type: 'unit.useSelector.simple' });
    const equalFn = jest.fn((select: Select, t: number) => {
      return [Array.from(select(userMapBox).keys()).sort().pop(), t] as const;
    });
    const equalSelector = selector(equalFn, { type: 'unit.useSelector.equal', equal: arrayEqual });
    const cacheFn = jest.fn((select: Select, t: number) => {
      return select(countBox) * select(userMapBox.size()) * select(sessionMapBox.size()) * t;
    });
    const cacheSelector = selector(cacheFn, { type: 'unit.useSelector.cache', cache: true });

    const { result, dispatch, rerender, mockFn } = renderUseSelector(
      ({ multiply }) => [
        simpleSelector(multiply),
        equalSelector(multiply),
        cacheSelector(multiply),
      ],
      { count: 1 },
      { multiply: 2 },
    );

    const checkCall = (simple: number, equal: number, cache: number, mock: number) => {
      expectCalled(simpleFn, simple);
      expectCalled(equalFn, equal);
      expectCalled(cacheFn, cache);
      expectCalled(mockFn, mock);
    };
    const checkResult = (...values: typeof result.current) => {
      expect(result.current).toEqual(values);
    };

    const mortyId = Morty.id + '';

    // first render
    checkCall(1, 1, 1, 1);
    checkResult(2, [mortyId, 2], 0);

    // update not used box
    dispatch(exampleBox.merge({ count: 1 }));
    checkCall(1, 1, 0, 0);

    // update props
    rerender({ multiply: 3 });
    checkCall(1, 1, 1, 1);
    checkResult(3, [mortyId, 3], 0);

    // update used box affect selected value
    await act(async () => {
      dispatch(countBox.add(1));
    });
    // first updated, then following items do not compute
    checkCall(2, 1, 1, 1);
    checkResult(6, [mortyId, 3], 0);
  });
});
