/*
 * @since 2021-12-31 12:08:24
 * @author junbao <junbao@moego.pet>
 */

import { boolBox } from 'amos-testing';

describe('BoolBox', function () {
  it('should create BoolBox', () => {
    boolBox.toggle();
    boolBox.open();
    boolBox.close();
  });
});
