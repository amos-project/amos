/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { applyMutations, onlineUserListBox } from 'amos-testing';

describe('ListBox', function () {
  it('should create ListBox', function () {
    expect(
      applyMutations(onlineUserListBox.initialState.reset([0]), [
        onlineUserListBox.concat([1, 2], [3, 4]),
        onlineUserListBox.copyWithin(2, 0, 1),
        onlineUserListBox.fill(5),
        onlineUserListBox.filterThis((v, index) => v === 5 && index > 0),
        onlineUserListBox.mapThis((v, index) => v * index),
        onlineUserListBox.pop(),
        onlineUserListBox.push(-1),
        onlineUserListBox.reverse(),
        onlineUserListBox.shift(),
        onlineUserListBox.unshift(-2),
        onlineUserListBox.slice(1),
        onlineUserListBox.sort(),
        onlineUserListBox.splice(1, 2, 1),
        onlineUserListBox.delete(1),
        onlineUserListBox.set(1, -3),
        onlineUserListBox.reset([1]),
      ]).map((s) => s.toJSON()),
    ).toEqual([
      [0, 1, 2, 3, 4],
      [0, 1, 0, 3, 4],
      [5, 5, 5, 5, 5],
      [5, 5, 5, 5],
      [0, 5, 10, 15],
      [0, 5, 10],
      [0, 5, 10, -1],
      [-1, 10, 5, 0],
      [10, 5, 0],
      [-2, 10, 5, 0],
      [10, 5, 0],
      [0, 5, 10],
      [0, 1],
      [1],
      [1, -3],
      [1],
    ]);
  });
});
