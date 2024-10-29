/*
 * @since 2022-01-08 11:37:15
 * @author junbao <junbao@moego.pet>
 */

import { expectCalled, expectCalledWith } from 'amos-testing';
import { append, applyEnhancers, Enhancer, enhancerCollector, override } from './enhancer';

describe('enhancer', () => {
  it('should apply enhancers', () => {
    const incr: Enhancer<[], number> = (next) => () => next() + 1;
    const double: Enhancer<[], number> = (next) => () => next() * 2;
    expect(applyEnhancers([incr, double], [], () => 1)).toBe(3);
  });
  it('should collect enhancers', () => {
    const collector = enhancerCollector<any[], any>();
    const f1 = jest.fn((next) => (i: any) => next(i + 1));
    const f2 = jest.fn((next) => (i: any) => next(i * 2));
    const f3 = jest.fn((i: any) => [i]);
    const u1 = collector(f1);
    collector(f2);
    const v1 = collector.apply([1], f3);
    expect(v1).toEqual([4]);
    expectCalled(f1);
    expectCalled(f2);
    expectCalled(f3);
    u1();
    const v2 = collector.apply([1], f3);
    expect(v2).toEqual([2]);
    expectCalled(f2);
    expectCalled(f3);
  });
  it('should override', () => {
    const a = {
      foo: (a: number) => a * 2,
    };
    override(a, 'foo', (foo) => {
      return (a: number) => {
        return foo(a + 1);
      };
    });
    const f1 = jest.fn();
    append(a, 'foo', f1);
    override(a, 'foo', (foo) => {
      return (a: number) => {
        return foo(a * 2);
      };
    });
    expect(a.foo(2)).toEqual(10);
    expectCalledWith(f1, [4]);
  });
});
