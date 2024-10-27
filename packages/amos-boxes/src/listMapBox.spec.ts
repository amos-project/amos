/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { createStore } from 'amos-core/src/index';
import { List } from 'amos-shapes';
import { postMediaListBox, runMutations, toJS } from 'amos-testing';

describe('ListMapBox', () => {
  it('should create mutations', () => {
    expect(
      runMutations(postMediaListBox.initialState.setAll({ 1: [1, 2, 3], 2: [2, 3], 3: [3] }), [
        postMediaListBox.setItem(1, [1]),
        postMediaListBox.setItem(1, new List([1])),
        postMediaListBox.setAll({ 0: [], 1: [1] }),
        postMediaListBox.setAll([
          [0, [1]],
          [1, [2]],
        ]),
        postMediaListBox.pushIn(1, 2),
        postMediaListBox.popIn(1),
        postMediaListBox.shiftIn(1),
        postMediaListBox.unshiftIn(1, 2, 3),
      ]).map((v) => toJS(v)),
    ).toEqual([
      { 1: [1], 2: [2, 3], 3: [3] },
      { 1: [1], 2: [2, 3], 3: [3] },
      { 0: [], 1: [1], 2: [2, 3], 3: [3] },
      { 0: [1], 1: [2], 2: [2, 3], 3: [3] },
      { 1: [1, 2, 3, 2], 2: [2, 3], 3: [3] },
      { 1: [1, 2], 2: [2, 3], 3: [3] },
      { 1: [2, 3], 2: [2, 3], 3: [3] },
      { 1: [2, 3, 1, 2, 3], 2: [2, 3], 3: [3] },
    ]);
  });
  it('should create selectors', () => {
    const store = createStore();
    store.dispatch(postMediaListBox.setAll({ 1: [1, 2, 3], 2: [2, 3], 3: [3] }));
    expect(
      store.select([
        postMediaListBox.getItem(1),
        postMediaListBox.getIn(1, 1),
        postMediaListBox.hasItem(0),
        postMediaListBox.hasIn(1, 2),
        postMediaListBox.hasIn(2, 2),
        postMediaListBox.size(),
      ]),
    ).toEqual([new List([1, 2, 3]), 2, false, true, false, 3]);
  });
});
