/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { createNumberBox } from './NumberBox';

describe('NumberBox', function () {
  it('should create NumberBox', function () {
    const box = createNumberBox(0);
    box.add(1);
    box.multiply(2);
  });
});
