/*
 * @since 2022-01-08 11:37:15
 * @author junbao <junbao@moego.pet>
 */

import { applyEnhancers, Enhancer } from './enhancer';

describe('enhancer', () => {
  it('should apply enhancers', () => {
    const incr: Enhancer<[], number> = (next) => () => next() + 1;
    const double: Enhancer<[], number> = (next) => () => next() * 2;
    expect(applyEnhancers([], [incr, double], () => 1)).toBe(3);
  });
});
