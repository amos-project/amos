/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { applyMutations, postMapBox, PostRecord, select, toJS } from 'amos-testing';

describe('RecordMapBox', function () {
  it('should create RecordMapBox', function () {
    expect(select(postMapBox.size())).toEqual(0);
    expect(
      toJS(
        applyMutations(postMapBox.initialState, [
          postMapBox.setItem(new PostRecord({ id: 1, title: 'Hello world' })),
          postMapBox.setItem(2, new PostRecord({ id: 2, title: 'Second' })),
          postMapBox.mergeItem(3, { title: 'Third' }),
          postMapBox.mergeItem({ id: 4, title: 'Forth' }),
          postMapBox.setAll([new PostRecord({ id: 5, title: 'Fifth' })]),
          postMapBox.setAll([[6, new PostRecord({ id: 6, title: 'Sixth' })]]),
          postMapBox.mergeAll([{ id: 7, title: 'Seventh' }]),
          postMapBox.mergeAll([[8, new PostRecord({ id: 8, title: 'Eighth' })]]),
        ]).pop(),
      ),
    ).toEqual({
      1: new PostRecord({ id: 1, title: 'Hello world' }).toJSON(),
      2: new PostRecord({ id: 2, title: 'Second' }).toJSON(),
      3: new PostRecord({ id: 3, title: 'Third' }).toJSON(),
      4: new PostRecord({ id: 4, title: 'Forth' }).toJSON(),
      5: new PostRecord({ id: 5, title: 'Fifth' }).toJSON(),
      6: new PostRecord({ id: 6, title: 'Sixth' }).toJSON(),
      7: new PostRecord({ id: 7, title: 'Seventh' }).toJSON(),
      8: new PostRecord({ id: 8, title: 'Eighth' }).toJSON(),
    });
  });
});
