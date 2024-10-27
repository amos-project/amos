/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { checkType, Rick, select, userPostListBox } from 'amos-testing';

describe('PagedListMapBox', () => {
  it('should create PagedListMapBox', () => {
    checkType(() => {
      // @ts-expect-error
      userPostListBox.mergeItem({});
      // @ts-expect-error
      userPostListBox.mergeItem('', {});
      // @ts-expect-error
      userPostListBox.mergeAll([{}]);
      userPostListBox.mergeAll([{ ownerId: 0 }]);
      userPostListBox.mergeAll({});
      userPostListBox.mergeItem({ ownerId: 1 });
    });
    select(userPostListBox.getItem(Rick.id)).getPage();
    select(userPostListBox.getItem(Rick.id)).getAll();
  });
});
