/*
 * @since 2021-12-31 12:08:24
 * @author junbao <junbao@moego.pet>
 */

import { createBoolBox } from './BoolBox';

describe('BoolBox', function () {
  it('should create BoolBox', () => {
    const box = createBoolBox();
    expect(box.initialState).toBeFalsy();
    expect(box.toggle()).toBeDefined();
    expect(box.open()).toBeDefined();
    expect(box.close()).toBeDefined();
  });
});
