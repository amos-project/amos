/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { applyMutations, postMediaListBox, toJS } from 'amos-testing';

describe('ListMapBox', function () {
  it('should create ListMapBox', function () {
    expect(
      applyMutations(postMediaListBox.initialState, [
        postMediaListBox.setItem(0, [1]),
        postMediaListBox.setAll([[1, [2, 3]]]),
      ]).map(toJS),
    ).toEqual([{ 0: [1] }, { 0: [1], 1: [2, 3] }]);
  });
});
