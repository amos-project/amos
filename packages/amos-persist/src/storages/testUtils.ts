/*
 * @since 2024-10-27 15:20:06
 * @author junbao <junbao@moego.pet>
 */

import type { PersistEntry } from '../types';
import type { StorageEngine } from './Storage';

export async function testStorage(s: StorageEngine) {
  await s.init?.();
  expect(
    await Promise.all([
      s.setMulti([
        ['A:1', 1, { a: 1 }],
        ['A:2', 1, { a: 2 }],
        ['B:1', 1, { b: 1 }],
        ['B:2', 1, { b: 2 }],
        ['B:3', 1, { b: 3 }],
        ['D:1', 1, { b: 1 }],
        ['D:2', 1, { d: 2 }],
        ['D:11', 1, { d: 11 }],
        ['DA:11', 1, { da: 11 }],
        ['DD:11', 1, { dd: 11 }],
        ['D:2', 1, { d: 22 }],
        ['D:3', 1, { d: 3 }],
        ['E:3', 1, { e: 3 }],
      ]),
      s.setMulti([
        ['A:1', 1, { a: 11 }],
        ['C:1', 1, { c: 1 }],
      ]),
    ]),
  ).toEqual([void 0, void 0]);
  expect(await Promise.all([s.removeMulti(['A:2', 'B:3']), s.removePrefix('C:')])).toEqual([
    void 0,
    void 0,
  ]);
  const r1 = await Promise.all([
    s.getMulti(['A:1', 'A:2', 'B:1']),
    s.getPrefix('D:'),
    s.getMulti(['C:1', 'E:3']),
  ]);
  r1.forEach((r, i, a) => {
    if (r.some((v) => v === null || typeof v[0] !== 'string')) {
      return;
    }
    a[i] = (r as PersistEntry[]).slice().sort(([a], [b]) => a.localeCompare(b));
  });
  expect(r1).toEqual([
    [[1, { a: 11 }], null, [1, { b: 1 }]],
    [
      ['D:1', 1, { b: 1 }],
      ['D:11', 1, { d: 11 }],
      ['D:2', 1, { d: 22 }],
      ['D:3', 1, { d: 3 }],
    ],
    [null, [1, { e: 3 }]],
  ]);
}

export function promisify<A extends any[], R>(
  fn: (...args: [...A, (error: unknown, value: R) => void]) => void,
): (...args: A) => Promise<R> {
  return (...args: A) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, value) => {
        if (err) {
          reject(new Error(err + '', { cause: err }));
        } else {
          resolve(value);
        }
      });
    });
  };
}
