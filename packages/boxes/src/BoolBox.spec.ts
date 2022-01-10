/*
 * @since 2021-12-31 12:08:24
 * @author junbao <junbao@moego.pet>
 */

import { darkModeBox, dispatch, select } from 'amos-testing';

describe('BoolBox', function () {
  it('should create BoolBox', () => {
    expect([
      select(darkModeBox),
      dispatch(darkModeBox.toggle()),
      select(darkModeBox),
      dispatch(darkModeBox.close()),
      select(darkModeBox),
      dispatch(darkModeBox.open()),
      select(darkModeBox),
      dispatch(darkModeBox.setState(false)),
      select(darkModeBox),
      dispatch(darkModeBox.mergeState(true)),
      select(darkModeBox),
    ]).toEqual([false, true, true, false, false, true, true, false, false, true, true]);
  });
});
