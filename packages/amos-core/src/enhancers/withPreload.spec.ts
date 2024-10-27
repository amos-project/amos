/*
 * @since 2024-10-25 11:25:09
 * @author junbao <junbao@moego.pet>
 */

import { countBox, Rick, sessionIdBox, userMapBox } from 'amos-testing';
import { createStore } from '../store';

describe('withPreload', () => {
  it('should preload state', () => {
    const store = createStore({
      preloadedState: {
        [countBox.key]: 1,
        [userMapBox.key]: {
          [Rick.id]: Rick.toJSON(),
        },
      },
    });
    expect(store.select([countBox, userMapBox, sessionIdBox])).toEqual([
      1,
      userMapBox.initialState.clear().setItem(Rick),
      0,
    ]);
  });
});
