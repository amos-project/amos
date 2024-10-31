/*
 * @since 2024-10-20 13:11:56
 * @author junbao <junbao@moego.pet>
 */

import { act } from '@testing-library/react';
import { action, type Dispatch, type Select } from 'amos-core';
import { countBox, expectCalled, sleep } from 'amos-testing';
import { clone } from 'amos-utils';
import { QueryResult, useQuery } from './useQuery';
import { renderDynamicHook } from './useSelector.spec';

const fn = async (dispatch: Dispatch, select: Select, multiply: number) => {
  dispatch(countBox.multiply(multiply));
  await sleep(10);
  dispatch(countBox.multiply(multiply));
  return multiply;
};

const simpleFn = jest.fn(fn);
const simple = action(simpleFn);

const stateFn = jest.fn(fn);
const state = action(stateFn).select(countBox);

describe('useQuery', () => {
  it('should useQuery', async () => {
    const a1 = simple(1);
    const { result, mockFn, rerender } = renderDynamicHook(
      ({ multiply }) => useQuery(simple(multiply)),
      { count: 1 },
      { multiply: 1 },
    );
    expectCalled(mockFn, 1);
    expect(result.current).toEqual([
      void 0,
      clone(new QueryResult(), {
        id: a1.id,
        _nextId: void 0,
        status: 'pending',
        promise: expect.any(Promise),
        value: void 0,
        error: void 0,
      }),
    ]);
    await act(async () => {
      await result.current[1].promise;
      await sleep(1);
    });
    expectCalled(mockFn, 1);
    expectCalled(simpleFn, 1);
    rerender({ multiply: 1 });
    expectCalled(mockFn, 1);
    expect(result.current[0]).toBe(1);
    expectCalled(simpleFn, 0);
  });

  it('should useQuery with selector', async () => {
    const a1 = state(1);
    const { result, mockFn, rerender } = renderDynamicHook(
      ({ multiply }) => useQuery(state(multiply)),
      { count: 1 },
      { multiply: 2 },
    );
    expectCalled(mockFn, 1);
    expect(result.current).toEqual([
      1,
      clone(new QueryResult(), {
        id: a1.id,
        _nextId: void 0,
        status: 'pending',
        promise: expect.any(Promise),
        value: void 0,
        error: void 0,
      }),
    ]);
    await act(async () => {
      await result.current[1].promise;
      await sleep(1);
    });
    expectCalled(mockFn, 1);
    expectCalled(stateFn, 1);
    rerender({ multiply: 1 });
    expectCalled(mockFn, 1);
    expect(result.current[0]).toBe(4);
    expectCalled(stateFn, 0);
  });
});
