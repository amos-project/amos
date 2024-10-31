/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import {
  checkType,
  postMapBox,
  PostRecord,
  runMutations,
  select,
  sessionMapBox,
  userMapBox,
} from 'amos-testing';

describe('RecordMapBox', () => {
  it('should cache initialState', () => {
    expect(sessionMapBox.getInitialState()).toBe(sessionMapBox.getInitialState());
    expect(userMapBox.getInitialState()).not.toBe(userMapBox.getInitialState());
  });
  it('should create RecordMapBox', () => {
    checkType(() => {
      // @ts-expect-error
      postMapBox.mergeAll([{ title: 'Ninth' }]);
    });
    expect(select(postMapBox.size())).toEqual(0);
    const v4 = new PostRecord({ id: 4, title: 'Forth' });
    expect(
      runMutations(postMapBox.getInitialState().mergeItem(4, { title: 'Forth' }), [
        postMapBox.setItem(new PostRecord({ id: 1, title: 'Hello world' })),
        postMapBox.setItem(2, new PostRecord({ id: 2, title: 'Second' })),
        postMapBox.mergeItem(3, { title: 'Third' }),
        postMapBox.mergeItem({ id: 4, title: 'Forth' }),
        postMapBox.setAll([new PostRecord({ id: 5, title: 'Fifth' })]),
        postMapBox.setAll([[6, new PostRecord({ id: 6, title: 'Sixth' })]]),
        postMapBox.mergeAll([{ id: 7, title: 'Seventh' }]),
        postMapBox.mergeAll([[8, new PostRecord({ id: 8, title: 'Eighth' })]]),
      ]).map((v) => v?.toJSON()),
    ).toEqual([
      { 1: new PostRecord({ id: 1, title: 'Hello world' }), 4: v4 },
      { 2: new PostRecord({ id: 2, title: 'Second' }), 4: v4 },
      { 3: new PostRecord({ id: 3, title: 'Third' }), 4: v4 },
      void 0,
      { 5: new PostRecord({ id: 5, title: 'Fifth' }), 4: v4 },
      { 6: new PostRecord({ id: 6, title: 'Sixth' }), 4: v4 },
      { 7: new PostRecord({ id: 7, title: 'Seventh' }), 4: v4 },
      { 8: new PostRecord({ id: 8, title: 'Eighth' }), 4: v4 },
    ]);
  });
});
