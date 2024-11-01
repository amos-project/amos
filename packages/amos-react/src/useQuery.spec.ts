/*
 * @since 2024-10-20 13:11:56
 * @author junbao <junbao@moego.pet>
 */

import { act } from '@testing-library/react';
import { action, type Dispatch, type Select } from 'amos-core';
import { countBox, expectCalled, expectCalledWith, sleep } from 'amos-testing';
import { clone } from 'amos-utils';
import { renderDynamicHook } from './testUtils';
import { QueryResult, QueryResultMap, useQuery } from './useQuery';

const fn = async (dispatch: Dispatch, select: Select, multiply: number) => {
  dispatch(countBox.multiply(multiply));
  await sleep(10);
  dispatch(countBox.multiply(multiply));
  return multiply;
};

const simpleFn = jest.fn(fn);
const simple = action(simpleFn, {
  key: 'simple',
});

const stateFn = jest.fn(fn);
const state = action(stateFn, {
  key: 'state',
}).select(countBox);

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
        status: 'pending',
        q: expect.any(Promise),
        value: void 0,
        error: void 0,
      }),
    ]);
    await act(async () => {
      await result.current[1].q;
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
    const { result, mockFn } = renderDynamicHook(
      ({ multiply }) => useQuery(state(multiply)),
      { count: 1 },
      { multiply: 2 },
    );
    /**
     * `renderHook` will auto perform useEffect synchronously, very tricky
     * the {@link state} update count synchronously and select that.
     * Then the component should be rendered twice as it watches countBox.
     * And the select result should be 2.
     */
    expectCalled(mockFn, 2);
    expectCalled(stateFn, 1);
    const query = clone(new QueryResult(), {
      id: a1.id,
      status: 'pending',
      q: expect.any(Promise),
      value: void 0,
      error: void 0,
    });
    expect(result.current).toEqual([2, query]);
    await act(async () => {
      await result.current[1].q;
    });
    expectCalledWith(mockFn, [
      { multiply: 2 },
      [4, clone(query, { status: 'fulfilled', value: 2 })],
    ]);
  });

  it('should not dispatch for SSR', () => {
    const { result, mockFn, rerender } = renderDynamicHook(
      ({ m, n }) => [useQuery(simple(m)), useQuery(n % 2 ? simple(n) : state(n))],
      {
        'amos.queries': {
          'simple:[2]': {
            status: 'fulfilled',
            value: 3, // fake value
          },
        },
      },
      { m: 2, n: 2 },
    );
    expectCalled(simpleFn, 0);
    expectCalled(stateFn, 1);
    expectCalled(mockFn, 1);
    expect(result.current[0][0]).toEqual(3);
    expect(result.current[1][0]).toEqual(0);
    rerender({ m: 2, n: 5 });
    expectCalled(simpleFn, 1);
    expectCalled(stateFn, 0);
    expectCalled(mockFn, 1);
    expect(result.current[0][0]).toEqual(3);
    expect(result.current[1][0]).toEqual(void 0);
  });

  it('should serialize', () => {
    const result = Object.assign(new QueryResult(), {
      isFromJS: true,
      q: expect.any(Promise),
      status: 'fulfilled',
      value: 3, // fake value
      error: void 0,
    });
    expect(result.toJSON()).toEqual({
      status: 'fulfilled',
      value: 3,
      error: void 0,
    });

    const queryMap = new QueryResultMap()
      .fromJS({
        '1': {
          status: 'fulfilled',
          value: 3,
          error: void 0,
        },
        '2': {
          status: 'rejected',
          value: void 0,
          error: {},
        },
      })
      .toJSON();
    expect(queryMap[2].q).rejects.toEqual({});
    expect(queryMap).toEqual({
      '1': result,
      '2': clone(result, {
        status: 'rejected',
        value: void 0,
        error: {},
      }),
    });
  });
});
