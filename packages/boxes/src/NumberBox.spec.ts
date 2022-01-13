/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { applyMutations, countBox } from 'amos-testing';

describe('NumberBox', function () {
  it('should create NumberBox', function () {
    // @ts-expect-error
    countBox.add('2');
    expect(
      applyMutations(countBox.initialState, [
        countBox.add(1),
        countBox.minus(-1),
        countBox.multiply(2),
        countBox.divide(2),
        countBox.mod(2),
      ]),
    ).toEqual([1, 2, 4, 2, 0]);
  });
});
