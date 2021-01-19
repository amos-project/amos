/*
 * @since 2020-11-04 10:58:11
 * @author acrazing <joking.young@gmail.com>
 */

import { selectCurrentUser } from '@kcats/testing';
import { strictEqual } from './utils';

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
