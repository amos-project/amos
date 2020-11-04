/*
 * @since 2020-11-04 11:16:17
 * @author acrazing <joking.young@gmail.com>
 */

import { arrayEqual } from './utils';

describe('utils', () => {
  it('should compare array shallow', () => {
    expect(arrayEqual([1], [1])).toBe(true);
    expect(arrayEqual([1], [1, 2])).toBe(false);
    expect(arrayEqual([1, 2], [1, 2])).toBe(true);
    expect(arrayEqual([1, 2], [1, 3])).toBe(false);
  });
});
