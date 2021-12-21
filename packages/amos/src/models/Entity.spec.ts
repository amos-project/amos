/*
 * @since 2021-10-25 17:21:47
 * @author junbao <junbao@mymoement.com>
 */

import { createEntityBox, Entity } from './Entity';

export class UserEntity extends Entity({
  id: 0,
  firstName: '',
  lastName: '',
  fatherId: 0,
}) {
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const Rick = new UserEntity({ id: 1, firstName: 'Rick', lastName: 'Sanchez' });
export const Beth = Rick.merge({ id: 2, firstName: 'Beth', fatherId: Rick.id });
export const Jerry = UserEntity.create({ id: 3, firstName: 'Jerry', lastName: 'Sanchez' });
export const Jessica = Jerry.set('id', 4).set('firstName', 'Jessica').set('fatherId', Jerry.id);
export const Morty = Jerry.merge({ id: 5, firstName: 'Morty' });
export const users = [Rick, Beth, Jerry, Jessica, Morty];

export function idCompare(a: { readonly id: number }, b: { readonly id: number }) {
  return a.id - b.id;
}

export const CurrentUser = createEntityBox('user.current', Rick);

describe('Entity', () => {
  it('should make Entity', () => {
    expect(users.map((u) => u.id)).toEqual([1, 2, 3, 4]);
    expect(users.map((u) => u.fullName())).toEqual([
      'Rick Sanchez',
      'Jessica Sanchez',
      'Morty Smith',
      'Beth Smith',
    ]);
    expect(users.map((u) => u.isValid())).toEqual([false, true, true, true]);
    expect(Morty.toJSON()).toEqual({ id: 3, firstName: 'Morty', lastName: 'Smith' });
  });

  it('should make entity box', () => {
    expect(CurrentUser.merge).toBeDefined();
    expect(CurrentUser.get('firstName')).toBeDefined();
  });

  it('should create entity ');
});
