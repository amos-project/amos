/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { dispatch, postMediaListBox, select, toJS } from 'amos-testing';

describe('ListMapBox', function () {
  it('should create ListMapBox', function () {
    dispatch(postMediaListBox.setItem(0, [1]));
    dispatch(postMediaListBox.setAll([[1, [2, 3]]]));
    dispatch(postMediaListBox.unshiftList(1, 4));
    dispatch(postMediaListBox.unshiftList(2, 5));
    expect(toJS(select(postMediaListBox))).toEqual([{ 0: [1] }, { 0: [1], 1: [5, 2, 3], 2: [5] }]);
  });
});
