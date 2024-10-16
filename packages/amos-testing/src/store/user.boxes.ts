/*
 * @since 2022-01-05 10:02:12
 * @author junbao <junbao@moego.pet>
 */

import { createListBox, createRecordMapBox } from 'amos-boxes';
import { Record } from 'amos-shapes';

export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  fatherId: number;
  motherId: number;
}

export class UserRecord extends Record<UserModel>({
  id: 0,
  firstName: '',
  lastName: '',
  fatherId: 0,
  motherId: 0,
}) {
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const InvalidUser = new UserRecord();
export const Rick = new UserRecord({ id: 1, firstName: 'Rick', lastName: 'Sanchez' });
export const Beth = Rick.merge({ id: 2, firstName: 'Beth', fatherId: Rick.id });
export const Jerry = InvalidUser.merge({ id: 3, firstName: 'Jerry', lastName: 'Sanchez' });
export const Jessica = Jerry.set('id', 4).set('firstName', 'Jessica').set('fatherId', Jerry.id);
export const Morty = Jerry.merge({ id: 5, firstName: 'Morty' });
export const users = [Rick, Beth, Jerry, Jessica, Morty];

export const userMapBox = createRecordMapBox(
  'user.userMap',
  new UserRecord(),
  'id',
).setInitialState((state) => state.setAll(users));

export const onlineUserListBox = createListBox('users.onlineList', 0);
