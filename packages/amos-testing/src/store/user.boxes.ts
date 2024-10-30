/*
 * @since 2022-01-05 10:02:12
 * @author junbao <junbao@moego.pet>
 */

import { listBox, recordMapBox } from 'amos-boxes';
import { Record } from 'amos-shapes';
import { isTruly } from 'amos-utils';

(Date.prototype as any).fromJS = (v: string) => new Date(v);

export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  fatherId: number;
  motherId: number;
  createdAt: Date;
}

export class UserRecord extends Record<UserModel>({
  id: 0,
  firstName: '',
  lastName: '',
  fatherId: 0,
  motherId: 0,
  createdAt: new Date(2020, 0, 1),
}) {
  fullName() {
    return [this.firstName, this.lastName].filter(isTruly).join(' ');
  }
}

export const InvalidUser = new UserRecord();
export const Rick = new UserRecord({ id: 1, firstName: 'Rick', lastName: 'Sanchez' });
export const Beth = Rick.merge({ id: 2, firstName: 'Beth', fatherId: Rick.id });
export const Jerry = InvalidUser.merge({ id: 3, firstName: 'Jerry', lastName: 'Sanchez' });
export const Jessica = Jerry.set('id', 4).set('firstName', 'Jessica').set('fatherId', Jerry.id);
export const Morty = Jerry.merge({ id: 5, firstName: 'Morty' });
export const users = [Rick, Beth, Jerry, Jessica, Morty];

export const userMapBox = recordMapBox('user.userMap', new UserRecord(), 'id');
userMapBox.initialState = userMapBox.initialState.setAll(users);

export const onlineUserListBox = listBox<number>('unit.users.onlineList').config({
  persist: false,
});
