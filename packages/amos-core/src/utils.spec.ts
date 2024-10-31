/*
 * @since 2024-10-25 23:31:52
 * @author junbao <junbao@moego.pet>
 */

import { countBox, Rick, selectDouble, selectDoubleCount, UserRecord } from 'amos-testing';
import { createStore } from './store';
import { Select } from './types';
import { resolveCacheKey, stringify } from './utils';

describe('core utils', () => {
  it('should stringify params', () => {
    expect(
      stringify([Rick, true, false, 0.001, 'HELLO WORLD', [{ foo: 'bar' }], null, void 0]),
    ).toEqual(
      [
        '[{createdAt:"' +
          new UserRecord().createdAt.toJSON() +
          '",fatherId:0,firstName:"Rick",id:1,lastName:"Sanchez",motherId:0}',
        'true',
        'false',
        '0.001',
        '"HELLO WORLD"',
        '[{foo:"bar"}]',
        'null',
        'undefined]',
      ].join(','),
    );
  });
  it('should create cache key', () => {
    const prefix = selectDouble(1).key + ':';
    const store = createStore();
    store.dispatch(countBox.setState(1));
    expect([
      resolveCacheKey(store.select, selectDouble(2), void 0),
      resolveCacheKey(store.select, selectDouble(2), countBox),
      resolveCacheKey(store.select, selectDouble(2), selectDoubleCount()),
      resolveCacheKey(store.select, selectDouble(2), [countBox, selectDoubleCount()]),
      resolveCacheKey(store.select, selectDouble(2), (select: Select) => select(countBox)),
      resolveCacheKey(store.select, selectDouble(2), (select: Select) => [
        select(countBox),
        select(selectDoubleCount()),
      ]),
    ]).toEqual([
      prefix + '[2]',
      prefix + '[2,1]',
      prefix + '[2,2]',
      prefix + '[2,1,2]',
      prefix + '[1]',
      prefix + '[1,2]',
    ]);
  });
});
