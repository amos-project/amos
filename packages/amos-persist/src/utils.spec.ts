/*
 * @since 2024-10-29 20:46:43
 * @author junbao <junbao@moego.pet>
 */

import { countBox, darkModeBox, onlineUserListBox, userMapBox } from 'amos-testing';
import { noop } from 'amos-utils';
import { persistBox } from './state';
import { MemoryStorage } from './storages/MemoryStorage';
import type { BoxPersistOptions, PersistOptions } from './types';
import { fromKey, shouldPersist, toKey, toPersistOptions } from './utils';

describe('persist utils', () => {
  it('should toKey', () => {
    expect([
      toKey(countBox),
      toKey(userMapBox),
      toKey(countBox, void 0),
      toKey(userMapBox, null),
      toKey(userMapBox, 1),
      toKey(countBox.key, void 0),
      toKey(userMapBox.key, null),
      toKey(userMapBox.key, 1),
    ]).toEqual([
      countBox.key,
      userMapBox.key + ':',
      countBox.key,
      userMapBox.key + ':',
      userMapBox.key + ':1',
      countBox.key,
      userMapBox.key + ':',
      userMapBox.key + ':1',
    ]);
    expect(() => toKey(countBox.key as any)).toThrow('key must use with rowId');
  });
  it('should fromKey', () => {
    expect([
      fromKey(toKey(countBox)),
      fromKey(toKey(userMapBox)),
      fromKey(toKey(userMapBox, 1)),
    ]).toEqual([void 0, '', '1']);
  });
  it('should toPersistOptions', () => {
    expect([
      toPersistOptions(countBox),
      toPersistOptions(persistBox),
      toPersistOptions(darkModeBox),
    ]).toEqual<BoxPersistOptions<any>[]>([{ version: 1 }, { version: 1 }, { version: 2 }]);
  });

  it('should shouldPersist', () => {
    const options: PersistOptions = {
      storage: new MemoryStorage(),
      onError: noop,
    };
    const alwaysOptions = { ...options, includes: () => true };
    const neverOptions = { ...options, excludes: () => true };
    const fullOptions = { ...alwaysOptions, ...neverOptions };
    expect([
      shouldPersist(options, countBox),
      shouldPersist(options, darkModeBox),
      shouldPersist(options, persistBox),
      shouldPersist(options, onlineUserListBox),
      shouldPersist(alwaysOptions, countBox),
      shouldPersist(alwaysOptions, darkModeBox),
      shouldPersist(alwaysOptions, persistBox),
      shouldPersist(alwaysOptions, onlineUserListBox),
      shouldPersist(neverOptions, countBox),
      shouldPersist(neverOptions, darkModeBox),
      shouldPersist(neverOptions, persistBox),
      shouldPersist(neverOptions, onlineUserListBox),
      shouldPersist(fullOptions, countBox),
      shouldPersist(fullOptions, darkModeBox),
      shouldPersist(fullOptions, persistBox),
      shouldPersist(fullOptions, onlineUserListBox),
    ]).toEqual([
      false,
      true,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  });
});
