/*
 * @since 2024-10-25 11:24:51
 * @author junbao <junbao@moego.pet>
 */

import { createStore, selector } from 'amos-core';
import { countBox, expectCalled, sessionIdBox, sessionMapBox, userMapBox } from 'amos-testing';

const store = createStore();
const f1 = jest.fn((select, v: number) => {
  return v * 2 * select(countBox);
});
const selectDouble = selector(f1);
const f2 = jest.fn((select, v: number) => select(selectDouble(v)) * 2);
const selectFourfold = selector(f2, { cache: true });
const f3 = jest.fn((select, plus: number = 0) => {
  const id = select(sessionIdBox);
  return (
    select(selectDouble(id)) * select(selectFourfold(id)) * select(selectFourfold(id + plus)) + plus
  );
});
const selectEightTimesCount = selector(f3, { cache: true });
const f4 = jest.fn((select, plus: number = 0) => {
  return select(countBox) * select(selectEightTimesCount(plus)) * 2;
});
const selectEightTwice = selector(f4);

describe('withCache', () => {
  it('should prepare for cache', () => {
    const s1 = countBox.add(1);
    const s2 = countBox.add(1);
    const s3 = sessionMapBox.getItem(1);
    const s4 = userMapBox.getItem(2);
    expect(sessionMapBox.id).not.toEqual(userMapBox.id);
    expect(s3.id).toEqual(sessionMapBox.id + '/getItem');
    expect(s4.id).toEqual(userMapBox.id + '/getItem');
    expect(s1.id).toEqual(s2.id);
  });
  it('should cache selector', () => {
    // add to snapshot
    store.select([countBox, sessionIdBox]);
    const eight = (v: number) => {
      const count = store.snapshot()[countBox.key] as number;
      const id = store.snapshot()[sessionIdBox.key] as number;
      const v11 = id * 2 * count;
      const v21 = v11 * 2;
      const v22 = (id + v) * 2 * count * 2;
      return v11 * v21 * v22 + v;
    };
    const assert = (v: number, c1: number, c2: number, c3: number) => {
      expect(store.select(selectEightTimesCount(v))).toBe(eight(v));
      expectCalled(f1, c1);
      expectCalled(f2, c2);
      expectCalled(f3, c3);
    };
    // 8: e(count, id, plus)
    // 4: f(count, id)
    // 2: d(count, id)
    // count: c(v)
    // session id: s(0)
    // s(0)
    // f(0) -> d(0) -> c(0)
    // f(1) -> d(1) -> c(0)
    assert(1, 3, 2, 1);
    // all cache
    // cache x 3
    assert(1, 3, 0, 0);
    // no cache: e, f(0, 0+2)
    //    cache:    f(0, 0+0)
    assert(2, 3, 1, 1);
    // all cache x 3
    assert(1, 3, 0, 0);
    store.dispatch(countBox.setState(1));
    // 7 = check deps cache x 3
    //      -> v22 is dirty
    //      -> calc v22 call x 1
    //      -> recompute
    //      -> call x 1, check v21 cache x 1, check v22 cache x 1
    // f(1) -> d(1) -> c(1)
    assert(1, 7, 1, 1);
    store.dispatch(sessionIdBox.setState(1));
    // 4 = check deps cache, break by id
    //      -> f(1) -> d(1) -> c(1)
    //      -> f(2) -> d(2) -> c(1)
    assert(1, 4, 1, 1);
    expect(store.select([selectDouble(1), selectEightTimesCount(1), selectEightTwice(1)])).toEqual([
      2,
      eight(1),
      eight(1) * 2,
    ]);
    [f1, f2, f3, f4].forEach((f) => f.mockClear());
    assert(1, 3, 0, 0);
  });
});
