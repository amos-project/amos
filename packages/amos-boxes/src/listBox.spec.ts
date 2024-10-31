/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { createStore } from 'amos-core';
import { List } from 'amos-shapes';
import { onlineUserListBox, runMutations } from 'amos-testing';

describe('ListBox', () => {
  it('should create mutation', () => {
    expect(
      runMutations(onlineUserListBox.getInitialState().reset([0, 1, 3, 2]), [
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
    const store = createStore();
    store.dispatch(onlineUserListBox.reset([0, 1, 3, 1, 2]));
    expect(
      store.select([
        onlineUserListBox.length(),
        onlineUserListBox.some((v) => v > 1),
        onlineUserListBox.findIndex((v) => v === 1),
        onlineUserListBox.flat(),
        onlineUserListBox.includes(1),
        onlineUserListBox.indexOf(4),
        onlineUserListBox.join(''),
        onlineUserListBox.lastIndexOf(1),
        onlineUserListBox.find((v) => v > 2),
        onlineUserListBox.filter((v) => v > 2),
        onlineUserListBox.get(1),
        onlineUserListBox.every((v) => v > 2),
      ]),
    ).toEqual([
      5,
      true,
      1,
      new List([0, 1, 3, 1, 2]),
      true,
      -1,
      '01312',
      3,
      3,
      new List([3]),
      1,
      false,
    ]);
  });
});
