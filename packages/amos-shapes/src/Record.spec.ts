/*
 * @since 2021-10-25 17:21:47
 * @author junbao <junbao@mymoement.com>
 */

import { UserRecord } from 'amos-testing';

describe('Record', () => {
  const u1 = new UserRecord();
  const u2 = new UserRecord({ id: 2 });
  it('should set & get Record', () => {
    expect([
      u1.isInitial(),
      u2.isInitial(),
      u2.get('id'),
      u2.get('firstName'),
      u2.set('id', 3),
      u2.set('firstName', 'A'),
      u2.merge({ id: 3, firstName: 'B' }),
      u2.update('firstName', (v, t) => t.lastName + ':' + v + ':C'),
      u2.set('lastName', 'D').fullName(),
    ]).toEqual([
      true,
      false,
      2,
      '',
      new UserRecord({ id: 3 }),
      new UserRecord({ id: 2, firstName: 'A' }),
      new UserRecord({ id: 3, firstName: 'B' }),
      new UserRecord({ id: 2, firstName: '::C' }),
      'D',
    ]);
  });
  it('should not update Record', () => {
    expect(
      [
        u2.set('id', 2),
        u2.set('firstName', ''),
        u2.merge({ id: 2, lastName: '' }),
        u2.update('firstName', () => '').update('id', (v) => v),
      ].map((u) => u === u2),
    ).toEqual([true, true, true, true]);
  });
});
