/*
 * @since 2024-11-14 23:00:43
 * @author junbao <junbao@moego.pet>
 */

import { createStore } from 'amos-core';
import { Map } from 'amos-shapes';
import { runMutations } from 'amos-testing';
import { toJS } from 'amos-utils';
import { mapMapBox } from './mapMapBox';

const accountDirtyPostMapBox = mapMapBox('unit.posts.accountDirtyMap', 0, 0, 0);

describe('MapMapBox', () => {
  it('should create mutations', () => {
    expect(
      runMutations(
        accountDirtyPostMapBox.getInitialState().setAll({
          1: [
            [1, 2],
            [3, 4],
          ],
          2: { 2: 3, 4: 5 },
        }),
        [
          accountDirtyPostMapBox.setItem(1, [[2, 3]]),
          accountDirtyPostMapBox.setItem(1, new Map<number, number>(0).setAll([[2, 3]])),
          accountDirtyPostMapBox.setAll({ 0: [], 1: [[2, 3]] }),
          accountDirtyPostMapBox.setAll([
            [0, [[1, 2]]],
            [1, { 2: 3 }],
          ]),
          accountDirtyPostMapBox.setItemIn(1, 2, 3),
          accountDirtyPostMapBox.deleteItemIn(1, 3),
          accountDirtyPostMapBox.mergeItemIn(1, 2, 3),
          accountDirtyPostMapBox.updateItemIn(1, 2, (v) => v + 1),
          accountDirtyPostMapBox.clearIn(1),
          accountDirtyPostMapBox.resetIn(1, { 2: 3 }),
        ],
      ).map((v) => toJS(v)),
    ).toEqual([
      { 1: { 2: 3 }, 2: { 2: 3, 4: 5 } },
      { 1: { 2: 3 }, 2: { 2: 3, 4: 5 } },
      { 0: {}, 1: { 2: 3 }, 2: { 2: 3, 4: 5 } },
      { 0: { 1: 2 }, 1: { 2: 3 }, 2: { 2: 3, 4: 5 } },
      { 1: { 1: 2, 2: 3, 3: 4 }, 2: { 2: 3, 4: 5 } },
      { 1: { 1: 2 }, 2: { 2: 3, 4: 5 } },
      { 1: { 1: 2, 2: 3, 3: 4 }, 2: { 2: 3, 4: 5 } },
      { 1: { 1: 2, 2: 1, 3: 4 }, 2: { 2: 3, 4: 5 } },
      { 1: {}, 2: { 2: 3, 4: 5 } },
      { 1: { 2: 3 }, 2: { 2: 3, 4: 5 } },
    ]);
  });
  it('should create selectors', () => {
    const store = createStore();
    store.dispatch(
      accountDirtyPostMapBox.setAll({
        1: [
          [1, 2],
          [3, 4],
        ],
        2: { 2: 3, 4: 5 },
      }),
    );
    expect(
      store.select([
        accountDirtyPostMapBox.getItem(1),
        accountDirtyPostMapBox.getItemIn(1, 1),
        accountDirtyPostMapBox.hasItem(0),
        accountDirtyPostMapBox.hasItemIn(1, 2),
        accountDirtyPostMapBox.hasItemIn(1, 3),
        accountDirtyPostMapBox.sizeIn(2),
        accountDirtyPostMapBox.size(),
      ]),
    ).toEqual([
      new Map(0).setAll([
        [1, 2],
        [3, 4],
      ]),
      2,
      false,
      false,
      true,
      2,
      2,
    ]);
  });
});
