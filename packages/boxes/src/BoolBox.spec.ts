/*
 * @since 2021-12-31 12:08:24
 * @author junbao <junbao@moego.pet>
 */

import { applyMutations, darkModeBox } from 'amos-testing';

describe('BoolBox', function () {
  it('should create BoolBox', () => {
    expect(
      applyMutations(false, [
        darkModeBox.toggle(),
        darkModeBox.open(),
        darkModeBox.close(),
        darkModeBox.close(),
        darkModeBox.open(),
        darkModeBox.toggle(),
      ]),
    ).toEqual([true, true, false, false, true, false]);
  });
});
