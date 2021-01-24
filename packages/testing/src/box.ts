/*
 * @since 2021-01-19 23:30:24
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, clone } from '@kcats/core';
import { reset } from './signal';

export class UserModel {
  readonly id: number = 0;
  readonly avatarPath: string = '';
  readonly firstName: string = '';
  readonly lastName: string = '';

  merge(props: Partial<UserModel>): UserModel {
    return clone(this, props);
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const userBox = new Box('users/current', new UserModel());

export const mergeUser = userBox.mutation((state, props: Partial<UserModel>) => state.merge(props));

export const countBox = new Box('count', 0);

countBox.subscribeSignal(reset, (state, data) => data.count);

export const incrCount = countBox.mutation((state) => state + 1);

export const addCount = countBox.mutation(
  (state, action: number = 1) => state + action,
  'ADD_COUNT',
);
