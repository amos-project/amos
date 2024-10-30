/*
 * @since 2024-10-18 22:33:36
 * @author junbao <junbao@moego.pet>
 */

import { fromJS, override } from 'amos-utils';
import { StoreEnhancer } from '../store';

export const withPreload = (): StoreEnhancer => {
  return (next) => (options) => {
    const store = next(options);
    const snapshot = options.preloadedState;
    if (!snapshot) {
      return store;
    }
    override(store, 'getInitialState', (getInitialState) => {
      return (box) => {
        if (Object.hasOwn(snapshot, box.key)) {
          return fromJS(box.initialState, snapshot[box.key]);
        }
        return getInitialState(box);
      };
    });
    return store;
  };
};
