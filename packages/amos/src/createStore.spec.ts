/*
 * @since 2021-08-02 10:50:17
 * @author junbao <junbao@mymoement.com>
 */

import { createStore, StoreEnhancer } from './createStore';
import { Snapshot } from './types';
import fn = jest.fn;

describe('createStore', () => {
  it('should works basically', () => {
    const spy = fn();
    const demoEnhancer: StoreEnhancer = (StoreClass) =>
      class Store extends StoreClass {
        snapshot(): Snapshot {
          spy();
          return super.snapshot();
        }
      };
    const store = createStore(void 0, void 0, demoEnhancer);
    store.snapshot();
    expect(spy).toBeCalled();
  });
});
