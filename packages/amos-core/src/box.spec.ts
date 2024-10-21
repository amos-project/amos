/*
 * @since 2020-11-04 10:25:48
 * @author acrazing <joking.young@gmail.com>
 */

import { applyMutations } from 'amos-testing';
import { box } from './box';

const intBox = box('unit.box.int', 1);

describe('Box', function () {
  it('should implement mutations', function () {
    expect(
      applyMutations(intBox.initialState, [
        intBox.setState(2),
        intBox.setState(),
        intBox.setState((state) => state * 4),
        intBox.setState((state) => state * 5),
      ]),
    ).toEqual([2, 3, 1, 4, 20]);
  });
});
