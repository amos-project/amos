/*
 * @since 2020-11-04 10:58:11
 * @author acrazing <joking.young@gmail.com>
 */

import { countBox, userBox } from './box.spec';
import { FunctionSelector, selector } from './selector';
import { strictEqual } from './utils';

export const selectCount: FunctionSelector<number> = (select) => select(countBox);
export const selectDoubleCount = selector((select) => select(countBox) * 2);
export const selectMultipleCount = selector((select, times: number) => select(countBox) * times);

export const selectCurrentUser = selector(
  (select) => select(userBox),
  void 0,
  void 0,
  'currentUser',
);

export const selectFullName = selector((select) => select(selectCurrentUser).fullName());

describe('selector', () => {
  it('should create selector', () => {
    const { ...props } = selectCurrentUser;
    expect(props).toEqual({
      type: 'currentUser',
      calc: props.calc,
      object: 'selector_factory',
      cache: false,
      equalFn: strictEqual,
    });
  });
});
