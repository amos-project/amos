/*
 * @since 2020-11-04 11:16:17
 * @author acrazing <joking.young@gmail.com>
 */

import { expectCalled, expectCalledWith } from 'amos-testing';
import {
  ANY,
  defer,
  must,
  nextSerialTicker,
  NotImplemented,
  removeElement,
  resolveConstructorValue,
  resolveFuncValue,
  toArray,
  toFunc,
  toType,
  tryFinally,
} from './misc';

describe('misc utils', () => {
  it('should try finally', () => {
    const f1 = jest.fn();
    const f2 = jest.fn();
    tryFinally(f1, f2);
    expectCalled(f1);
    expectCalled(f2);
    // @ts-expect-error
    tryFinally(() => 1, f2);
    // @ts-expect-error
    tryFinally(async () => void 0, f2);
  });
  it('should work as expected', async () => {
    expect(() => must(false, 'MUST')).toThrow(
      Object.assign(new Error('MUST'), {
        name: 'AmosError',
      }),
    );
    expect(() => must(true, 'MUST')).not.toThrow();
    expect(ANY).toBe(void 0);

    class A {
      constructor(readonly a: number) {}
    }

    expect([
      resolveConstructorValue(1),
      resolveConstructorValue(A, 1),
      resolveConstructorValue(new A(2) as typeof A | A, 1),
    ]).toEqual([1, new A(1), new A(2)]);

    expect(toFunc(1)()).toEqual(1);
    expect(toFunc((v: number) => v * 2)(3)).toEqual(6);

    expect(resolveFuncValue(1)).toEqual(1);
    expect(resolveFuncValue((v: number) => v * 2, 3)).toEqual(6);

    const arr = [1, 3, 2, 3, 1];
    expect(removeElement(arr, 3) === arr).toBe(true);
    expect(arr).toEqual([1, 2, 3, 1]);

    expect(toArray(1)).toEqual([1]);
    expect(toArray([1, 2])).toEqual([1, 2]);
    expect(toArray([1, 2].entries())).toEqual([
      [0, 1],
      [1, 2],
    ]);
    expect(toArray('abc')).toEqual(['abc']);
    const f1 = jest.fn();
    const ticker = nextSerialTicker<number>(f1);
    ticker(1, 2, 3);
    ticker(4, 3, 2);
    expect(f1).not.toHaveBeenCalled();
    await Promise.resolve();
    expectCalledWith(f1, [[1, 2, 3, 4, 3, 2]]);

    const d = defer<number>();
    const r1 = await d.exec(() => 1);
    expect(r1).toEqual(1);

    const ne = new NotImplemented();
    expect(ne).toBeInstanceOf(Error);
    expect(ne).toBeInstanceOf(NotImplemented);

    expect(
      [1, null, void 0, 1n, Symbol.iterator, Symbol, new Date(), Object.create(null)].map(toType),
    ).toEqual([
      'number',
      'null',
      'undefined',
      'bigint',
      'symbol',
      'function',
      'Date',
      '[object Object]',
    ]);
  });
});
