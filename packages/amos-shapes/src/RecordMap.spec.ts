/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { checkType, UserRecord } from 'amos-testing';
import { pick } from 'lodash';
import { RecordMap } from './RecordMap';

describe('RecordMap', () => {
  const m1 = new RecordMap(new UserRecord(), 'id');
  const u1 = new UserRecord({ id: 1, firstName: 'A' });
  const u2 = new UserRecord({ id: 2, firstName: 'B' });
  const p1 = pick(u1, ['id', 'firstName']);
  const p2 = pick(u2, ['firstName']);
  const j0 = {};
  const j1 = { 1: u1 };
  const j2 = { 2: u2 };
  const j12 = { 1: u1, 2: u2 };

  it('should update RecordMap', () => {
    checkType(() => {
      // @ts-expect-error
      m1.setAll(u1.toJSON());
      // @ts-expect-error
      m1.mergeAll({ 1: [1, p1] });
      // @ts-expect-error
      m1.mergeAll([p2]);
    });
    expect(
      [
        m1.setItem(u2),
        m1.setItem(1, u1),
        m1.mergeItem(p1),
        m1.mergeItem(2, p2),
        m1.setAll([u1, u2]),
        m1.setAll([[1, u1], u2]),
        m1.setAll([
          [1, u1],
          [2, u2],
        ]),
        m1.setAll({ 1: u1, 2: u2 }),
        m1.mergeAll([p1]),
        m1.mergeAll([p1, [2, p2]]),
        m1.mergeAll([[2, p2]]),
        m1,
      ].map((m) => m.toJSON()),
    ).toEqual([j2, j1, j1, j2, j12, j12, j12, j12, j1, j12, j2, j0]);
  });

  const m3 = m1.setAll([u1, u2]);
  it('should not update RecordMap', () => {
    expect([
      m3.setItem(u1),
      m3.setAll([u2]),
      m3.mergeItem(p1),
      m3.mergeItem(2, p2),
      m3.mergeAll({ 1: p1 }),
      m3.mergeAll([p1, [2, p2]]),
    ]).toEqual([m3, m3, m3, m3, m3, m3]);
  });

  it('should call on item', () => {
    // @ts-expect-error
    m3.setIn(1, 'firstName', 1)
    expect([
      m3.setIn(1, 'firstName', 'B').toJSON(),
      m3.updateIn(3, 'lastName', (v, t) => t.lastName + ':' + v + ':C').toJSON(),
      m3.mergeIn(3, { fatherId: 1 }).toJSON(),
      m3.getIn(1, 'firstName'),
      m3.getIn(3, 'id'),
    ]).toEqual([
      { 1: u1.set('firstName', 'B'), 2: u2 },
      { ...j12, 3: new UserRecord({ lastName: '::C' }, false) },
      { ...j12, 3: new UserRecord({ fatherId: 1 }, false) },
      'A',
      0,
    ]);
  });
});
