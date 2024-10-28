/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { createStore } from 'amos-core';
import { checkType, Jessica, Morty, Rick, runMutations, UserRecord } from 'amos-testing';
import { mapBox } from './mapBox';

enum MK {
  K0,
  K1,
  K2,
  K3,
  K4,
  K5,
  K6,
}

const unitMapBox = mapBox('amos.unit.map', MK.K0, Rick as UserRecord | number);
unitMapBox.initialState = unitMapBox.initialState.setAll({
  1: 1,
  2: Morty,
});

describe('MapBox', () => {
  it(
    'should work with ts',
    checkType(() => {
      unitMapBox.setItem(1, 1);
      // @ts-expect-error
      unitMapBox.setItem(1, '');
      // @ts-expect-error
      unitMapBox.mergeItem(1, []);
      // @ts-expect-error
      unitMapBox.mergeItem(1, []);
      // @ts-expect-error
      unitMapBox.mergeAll([[-1, 2]]);
      // @ts-expect-error
      unitMapBox.mergeAll({ '-1': 1 });
    }),
  );
  it('should create mutations', () => {
    expect(
      runMutations(unitMapBox.initialState, [
        unitMapBox.setItem(1, Rick),
        unitMapBox.setItem(2, 2),
        unitMapBox.setItem(3, Morty),
        unitMapBox.setItem(4, 4),
        unitMapBox.setItem(1, 1),
        unitMapBox.setAll([
          [1, Rick],
          [2, 2],
          [3, Morty],
          [4, 4],
        ]),
        unitMapBox.setAll({ 1: Rick, 2: 2, 3: Morty, 4: 4 }),
        unitMapBox.setAll({ 1: 1, 2: Morty }),
        unitMapBox.mergeItem(1, 2),
        unitMapBox.mergeItem(2, { firstName: '2' }),
        unitMapBox.mergeItem(3, { firstName: '3' }),
        unitMapBox.mergeItem(4, 4),
        unitMapBox.mergeItem(1, 1),
        unitMapBox.mergeAll([
          [1, 2],
          [2, { firstName: '2' }],
          [3, { firstName: '3' }],
          [4, 4],
        ]),
        unitMapBox.mergeAll(
          (
            [
              [1, 2],
              [2, { firstName: '2' }],
              [3, { firstName: '3' }],
              [4, 4],
            ] as const
          ).values(),
        ),
        unitMapBox.mergeAll({
          1: 2,
          2: { firstName: '2' },
          3: { firstName: '3' },
          4: 4,
        }),
        unitMapBox.mergeAll({
          1: 1,
          2: { firstName: 'Morty' },
        }),
        unitMapBox.updateItem(1, (v) => (v as number) * 2),
        unitMapBox.updateItem(2, (v) => (v as UserRecord).merge({ firstName: '2' })),
        unitMapBox.updateItem(3, (v) => (v as UserRecord).merge({ firstName: '3' })),
        unitMapBox.updateItem(2, (v) => (v as UserRecord).merge({ firstName: 'Morty' })),
        unitMapBox.updateAll((v) => (typeof v === 'number' ? v * 2 : v)),
        unitMapBox.updateAll((v) => v),
        unitMapBox.removeItem(1),
        unitMapBox.removeItem(3),
        unitMapBox.removeAll([1, 3]),
        unitMapBox.removeAll([3, 4]),
        unitMapBox.clear(),
        unitMapBox.reset({ 1: 2, 3: Morty }),
      ]).map((v) => v?.toJSON()),
    ).toEqual([
      { 1: Rick, 2: Morty },
      { 1: 1, 2: 2 },
      { 1: 1, 2: Morty, 3: Morty },
      { 1: 1, 2: Morty, 4: 4 },
      void 0,
      { 1: Rick, 2: 2, 3: Morty, 4: 4 },
      { 1: Rick, 2: 2, 3: Morty, 4: 4 },
      void 0,
      { 1: 2, 2: Morty },
      { 1: 1, 2: Morty.set('firstName', '2') },
      { 1: 1, 2: Morty, 3: Rick.set('firstName', '3') },
      { 1: 1, 2: Morty, 4: 4 },
      void 0,
      { 1: 2, 2: Morty.set('firstName', '2'), 3: Rick.set('firstName', '3'), 4: 4 },
      { 1: 2, 2: Morty.set('firstName', '2'), 3: Rick.set('firstName', '3'), 4: 4 },
      { 1: 2, 2: Morty.set('firstName', '2'), 3: Rick.set('firstName', '3'), 4: 4 },
      { 1: 1, 2: Morty },
      { 1: 2, 2: Morty },
      { 1: 1, 2: Morty.set('firstName', '2') },
      { 1: 1, 2: Morty, 3: Rick.set('firstName', '3') },
      void 0,
      { 1: 2, 2: Morty },
      void 0,
      { 2: Morty },
      void 0,
      { 2: Morty },
      void 0,
      {},
      { 1: 2, 3: Morty },
    ]);
    expect(runMutations(unitMapBox.initialState.clear(), [unitMapBox.clear()])).toEqual([void 0]);
  });
  it('should create selectors', () => {
    const store = createStore();
    expect(
      store.select([
        unitMapBox.getItem(1),
        unitMapBox.getItem(2),
        unitMapBox.getItem(3),
        unitMapBox.hasItem(1),
        unitMapBox.hasItem(3),
        unitMapBox.size(),
      ]),
    ).toEqual([1, Morty, Rick, true, false, 2]);
  });
  it('should should init options', () => {
    expect([
      unitMapBox.table!.hasRow(unitMapBox.initialState, '1'),
      unitMapBox.table!.hasRow(unitMapBox.initialState, '3'),
      unitMapBox.table!.toRows(unitMapBox.initialState),
      unitMapBox.table!.hydrate(unitMapBox.initialState, { 1: 2, 3: Jessica.toJSON() }),
    ]).toEqual([
      true,
      false,
      { 1: 1, 2: Morty },
      unitMapBox.initialState.setAll({ 1: UserRecord.defaultInstance(), 3: Jessica }),
    ]);
  });
});
