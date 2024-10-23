/*
 * @since 2020-11-04 10:58:05
 * @author acrazing <joking.young@gmail.com>
 */

import { render } from '@testing-library/react';
import { createStore, Store } from 'amos-core';
import { Consumer, Provider } from './context';

describe('provider', () => {
  it('should provide store', () => {
    const store = createStore();
    let usedStore: Store | null = null;
    render(
      <Provider store={store}>
        <Consumer>
          {(store1) => {
            usedStore = store1;
            return null;
          }}
        </Consumer>
      </Provider>,
    );
    expect(usedStore).toBe(store);
  });
});
