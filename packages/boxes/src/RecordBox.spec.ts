/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { dispatch, exampleBox, select } from 'amos-testing';

describe('RecordBox', function () {
  it('should create RecordBox', function () {
    select(exampleBox).resolveType();
    select(exampleBox.get('link')).substr(1);
    select(exampleBox).isValid().valueOf();
    dispatch(exampleBox.set('link', 'https://github.com/'));
    dispatch(exampleBox.update('count', (c) => c + 1));
    dispatch(exampleBox.merge({ title: 'hello', content: 'world' }));
    expect(select(exampleBox).toJSON()).toEqual({
      title: 'hello',
      content: 'world',
      link: 'https://github.com/',
      count: 1,
    });
    expect(select(exampleBox).resolveType()).toBe('http');
  });
});
