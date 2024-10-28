/*
 * @since 2024-10-17 20:04:24
 * @author junbao <junbao@moego.pet>
 */

import { createStore } from 'amos-core';
import { runMutations } from 'amos-testing';
import { arrayBox } from './arrayBox';

const unitArrayBox = arrayBox<number>('points').config({
  initialState: [1, 2, 11],
});

describe('ArrayBox', () => {
  it('should create mutations', () => {
    expect(
      runMutations(unitArrayBox.initialState, [
        unitArrayBox.push(1, 2),
        unitArrayBox.pop(),
        unitArrayBox.unshift(1, 2),
        unitArrayBox.shift(),
        unitArrayBox.splice(1, 1, 3, 4),
        unitArrayBox.sort(),
        unitArrayBox.delete(2, 11),
        unitArrayBox.map((v) => v + 1),
        unitArrayBox.slice(1, 2),
        unitArrayBox.filter((v) => v > 1),
        unitArrayBox.setState([2, 3]),
      ]),
    ).toEqual([
      [1, 2, 11, 1, 2],
      [1, 2],
      [1, 2, 1, 2, 11],
      [2, 11],
      [1, 3, 4, 11],
      [1, 11, 2],
      [1],
      [2, 3, 12],
      [2],
      [2, 11],
      [2, 3],
    ]);
  });
  it('should create selectors', () => {
    const store = createStore();
    store.dispatch(unitArrayBox.push(11));
    expect(
      store.select([
        unitArrayBox,
        unitArrayBox.at(1),
        unitArrayBox.includes(11),
        unitArrayBox.indexOf(11),
        unitArrayBox.lastIndexOf(11),
      ]),
    ).toEqual([[1, 2, 11, 11], 2, true, 2, 3]);
  });
});
