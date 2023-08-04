/*
 * @since 2022-01-08 11:37:27
 * @author junbao <junbao@moego.pet>
 */

import { falsy, identity, truly } from './equals';

describe('equals', function () {
  it('should verify equals', function () {
    expect([0, 1, 2].map(identity)).toEqual([0, 1, 2]);
    expect([0, 1, 2].filter(identity)).toEqual([1, 2]);

    expect([0, 1, '', null, undefined, false].map(truly)).toEqual([
      true,
      true,
      true,
      false,
      false,
      true,
    ]);
    expect([0, 1, '', null, undefined, false].map(falsy)).toEqual([
      false,
      false,
      false,
      true,
      true,
      false,
    ]);
  });
});
