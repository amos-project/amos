/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { onlineUserListBox, runMutations } from 'amos-testing';

describe('ListBox', () => {
  it('should create mutation', () => {
    expect(
      runMutations(onlineUserListBox.initialState.reset([0, 1, 3, 2]), [
        onlineUserListBox.concat([1, 2, 3]),
        onlineUserListBox.copyWithin(2, 0, 2),
        onlineUserListBox.fill(-1, 1, 3),
        onlineUserListBox.pop(),
        onlineUserListBox.push(1, 2),
        onlineUserListBox.reverse(),
        onlineUserListBox.shift(),
        onlineUserListBox.unshift(1, 2),
        onlineUserListBox.slice(1, 2),
        onlineUserListBox.sort(),
        onlineUserListBox.splice(1, 2, -1),
        onlineUserListBox.delete(3),
        onlineUserListBox.set(1, 2),
        onlineUserListBox.set(1, 1),
        onlineUserListBox.reset([1, 2]),
      ]).map((s) => s?.toJSON()),
    ).toEqual([
      [0, 1, 3, 2, 1, 2, 3],
      [0, 1, 0, 1],
      [0, -1, -1, 2],
      [0, 1, 3],
      [0, 1, 3, 2, 1, 2],
      [2, 3, 1, 0],
      [1, 3, 2],
      [1, 2, 0, 1, 3, 2],
      [1],
      [0, 1, 2, 3],
      [0, -1, 2],
      [0, 1, 2],
      [0, 2, 3, 2],
      void 0,
      [1, 2],
    ]);
  });
  it('should create selectors', () => {

  });
});
