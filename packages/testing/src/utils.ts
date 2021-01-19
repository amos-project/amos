/*
 * @since 2021-01-19 23:36:37
 * @author acrazing <joking.young@gmail.com>
 */

import Mock = jest.Mock;

export function expectCalled(fn: (...args: any[]) => any, count = 1) {
  expect(fn).toBeCalledTimes(count);
  (fn as Mock).mockClear();
}
