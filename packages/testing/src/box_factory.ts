/*
 * @since 2021-01-19 23:41:39
 * @author acrazing <joking.young@gmail.com>
 */

import { createBoxFactory } from 'amos-state';
import { UserModel } from './box';

export const createUserBox = createBoxFactory(UserModel, { merge: true }, { fullName: true });
export const userFactoryBox = createUserBox('users/factory', new UserModel());
