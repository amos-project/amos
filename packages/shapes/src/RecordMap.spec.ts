/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { Rick, UserRecord } from 'amos-testing';
import { RecordMap } from './RecordMap';

describe('RecordMap', function () {
  it('should create RecordMap', function () {
    const userMap = new RecordMap(new UserRecord(), 'id');
    userMap.mergeItem(Rick.id, Rick.toJSON());
    userMap.mergeItem(1, { firstName: 'Rick' });
    userMap.mergeItem(Rick.toJSON());
  });
});
