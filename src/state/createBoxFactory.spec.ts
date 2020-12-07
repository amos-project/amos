/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

import { Box } from '../core/box';
import { UserModel } from '../core/box.spec';
import { createBoxFactory } from './createBoxFactory';

export const createUserBox = createBoxFactory(UserModel, { merge: true }, { fullName: true });
export const userFactoryBox = createUserBox('users/factory', new UserModel());

describe('createBoxFactory', () => {
  it('should create box factory', () => {
    expect(userFactoryBox).toBeInstanceOf(Box);
    expect(typeof userFactoryBox.fullName()).toBe('function');
    expect(
      userFactoryBox.merge({ firstName: 'hello', lastName: 'world' }).mutator(new UserModel(), {}),
    ).toEqual(
      new UserModel().merge({
        firstName: 'hello',
        lastName: 'world',
      }),
    );
  });
});
