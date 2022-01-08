/*
 * @since 2022-01-08 11:37:15
 * @author junbao <junbao@moego.pet>
 */

import { applyEnhancers, Enhancer } from './enhancer';

describe('enhancer', function () {
  it('should apply enhancers', function () {
    const incr: Enhancer<number> = (id) => id + 1;
    const double: Enhancer<number> = (id) => id * 2;
    expect(applyEnhancers(1, [incr, double])).toBe(4);
  });
});
