/*
 * @since 2024-10-31 20:01:40
 * @author junbao <junbao@moego.pet>
 */
import { renderHook, type RenderHookResult } from '@testing-library/react';
import { createStore, Snapshot, Store } from 'amos-core';
import { createElement } from 'react';
import { Provider } from './context';

export function renderDynamicHook<P, T>(
  fn: (props: P) => T,
  preloadedState?: Snapshot,
  initialProps?: P,
): RenderHookResult<T, P> & Store & { mockFn: jest.Mock } {
  const store = createStore({ preloadedState });
  const mockFn = jest.fn();
  const hook = renderHook(
    (props: P) => {
      const value = fn(props);
      mockFn(props, value);
      return value;
    },
    {
      wrapper: (props) => createElement(Provider, { store, children: props.children }),
      initialProps,
    },
  );
  return Object.assign(hook, store, { mockFn: mockFn });
}
