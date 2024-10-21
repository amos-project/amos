/*
 * @since 2024-10-18 23:40:53
 * @author junbao <junbao@moego.pet>
 */

import { recordMapBox } from 'amos-boxes';
import { box, signal } from 'amos-core';
import { Record } from 'amos-shapes';

export interface UserModel {
  id: number;
  name: string;
}

export class UserRecord extends Record<UserModel>({
  id: 0,
  name: '',
}) {}

export interface SignOutEvent {
  userId: number;
  keepData: boolean;
}

export const signOutSignal = signal<SignOutEvent>('user.signOut');

export const signInSignal = signal<UserModel>('user.signIn');

export const userMapBox = recordMapBox('users', UserRecord, 'id');

userMapBox.subscribe(signOutSignal, (state, data) => {
  if (!data.keepData) {
    return state.removeItem(data.userId);
  }
  return state;
});

export const currentUserIdBox = box('users.currentUserId', 0);
