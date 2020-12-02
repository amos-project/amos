/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

import { Box } from '..';
import { UserModel } from '../core/box.spec';
import { createBoxFactory } from './createBoxFactory';

export const createUserBox = createBoxFactory(UserModel, ['merge'] as const, ['fullName'] as const);
export const userFactoryBox = createUserBox('users/factory', new UserModel());

describe('createBoxFactory', () => {
  it('should create box factory', () => {
    expect(userFactoryBox).toBeInstanceOf(Box);
    expect(typeof userFactoryBox.fullName()).toBe('function');
    expect(userFactoryBox.merge({ firstName: 'hello', lastName: 'world' }).args).toEqual({
      firstName: 'hello',
      lastName: 'world',
    });
  });
});
