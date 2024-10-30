/*
 * @since 2024-10-17 11:48:53
 * @author junbao <junbao@moego.pet>
 */

import { type Compute } from 'amos-core';
import { countBox, select, sessionMapBox, userMapBox } from 'amos-testing';
import { hydrate } from './state';
import { toKey } from './utils';

describe('persist state', () => {
  it('should set conflict key', () => {
    const action = hydrate([countBox, [userMapBox, 1], [sessionMapBox, [2, 3]]]);
    expect(action.conflictPolicy).toBe('always');
    expect((action.conflictKey as Compute)(select, ...action.args)).toEqual([
      toKey(countBox),
      toKey(userMapBox, 1),
      toKey(sessionMapBox, 2),
      toKey(sessionMapBox, 3),
    ]);
  });
});
