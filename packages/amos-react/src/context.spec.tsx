/*
 * @since 2020-11-04 10:58:05
 * @author acrazing <joking.young@gmail.com>
 */

import { renderHook } from '@testing-library/react';
import { createStore } from 'amos-core';
import { FC } from 'react';
import { Provider, useDispatch, useStore } from './context';

describe('Context', () => {
  it('should use store & dispatch', async () => {
    const store = createStore();
    const wrapper: FC = (props: any) => <Provider store={store}>{props.children}</Provider>;

    const renderStore = renderHook(() => useStore(), { wrapper });
    expect(renderStore.result.current).toBe(store);

    const renderDispatch = renderHook(() => useDispatch(), { wrapper });
    expect(renderDispatch.result.current).toBe(store.dispatch);

    expect(
      renderHook(() => {
        try {
          return useStore();
        } catch (e: any) {
          return e.message;
        }
      }).result.current,
    ).toBe('It seems you are using hooks without <Provider />.');
  });
});
