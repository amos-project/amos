/*
 * @since 2021-10-25 17:21:47
 * @author junbao <junbao@mymoement.com>
 */

import { Morty, users } from 'amos-testing';

describe('Record', () => {
  it('should make Record', () => {
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
});
