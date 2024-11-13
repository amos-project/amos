/*
 * @since 2024-10-18 23:40:53
 * @author junbao <junbao@moego.pet>
 */

import { box, Record, recordMapBox, signal } from 'amos';
import { hashCode } from './todo.boxes';

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

export const userMapBox = recordMapBox('users', UserRecord, 'id').setInitialState((s) => {
  return s.mergeItem(hashCode('Amos'), { name: 'Amos' });
});

userMapBox.subscribe(signOutSignal, (state, data) => {
  if (!data.keepData) {
    return state.deleteItem(data.userId);
  }
  return state;
});

export const currentUserIdBox = box('users.currentUserId', hashCode('Amos'));
