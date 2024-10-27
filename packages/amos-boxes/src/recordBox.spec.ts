/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { createStore } from 'amos-core/src/index';
import { exampleBox, ExampleRecord, runMutations } from 'amos-testing';

describe('RecordBox', () => {
  it('should create mutations', () => {
    expect(
      runMutations(exampleBox.initialState, [
        exampleBox.set('title', 'A'),
        exampleBox.merge({ title: 'B' }),
        exampleBox.update('title', (v, t) => v + ':' + t.title + ':' + 'C'),
        exampleBox.set('title', ''),
        exampleBox.merge({ title: '' }),
        exampleBox.update('title', (v, t) => v + ''),
      ]),
    ).toEqual([
      new ExampleRecord({ title: 'A' }),
      new ExampleRecord({ title: 'B' }),
      new ExampleRecord({ title: '::C' }),
      void 0,
      void 0,
      void 0,
    ]);
  });
  it('should create selectors', () => {
    const store = createStore();
    expect(store.select([exampleBox.get('title'), exampleBox.isInitial()])).toEqual(['', true]);
    store.dispatch(exampleBox.merge({ title: 'A' }));
    expect(store.select([exampleBox.get('title'), exampleBox.isInitial()])).toEqual(['A', false]);
  });
});
