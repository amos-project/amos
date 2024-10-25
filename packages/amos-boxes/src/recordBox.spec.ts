/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { dispatch, exampleBox, select } from 'amos-testing';

describe('RecordBox', function () {
  it('should create RecordBox', function () {
    expect([
      select(exampleBox.isInitial()),
      dispatch(exampleBox.set('title', 'Hello world')).title,
      dispatch(exampleBox.set('count', 1)).count,
      dispatch(exampleBox.merge({ content: 'First', count: 2 })).count,
      dispatch(exampleBox.update('count', (count, record) => count * record.count)).count,
      select(exampleBox.get('count')),
      select(exampleBox.isInitial()),
      select(exampleBox).toJSON(),
    ]).toEqual([
      false,
      'Hello world',
      1,
      2,
      4,
      4,
      true,
      { title: 'Hello world', count: 4, link: '', content: 'First' },
    ]);
  });
});
