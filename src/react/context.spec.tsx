/*
 * @since 2020-11-04 10:58:05
 * @author acrazing <joking.young@gmail.com>
 */

import { render } from '@testing-library/react';
import React from 'react';
import { createStore, Store } from '../core/store';
import { Consumer, Provider } from './context';

describe('provider', () => {
  it('should provide store', () => {
    const store = createStore();
    let usedStore: Store | undefined;
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
