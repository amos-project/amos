/*
 * @since 2024-10-25 11:24:58
 * @author junbao <junbao@moego.pet>
 */

import { countBox, expectCalled, sleep } from 'amos-testing';
import { action } from '../action';
import { createStore } from '../store';
import type { Dispatch, Select } from '../types';

const basicFn = jest.fn(async () => {
  await sleep(1);
});

const basicAsync = action(basicFn);

const leadingFn = jest.fn(async (dispatch: Dispatch, select: Select, id: number) => {
  await sleep(1);
  return id;
});

const leadingAsync = action(leadingFn, {
  conflictPolicy: 'leading',
  conflictKey: [countBox],
});

describe('withConcurrent', () => {
  it('should dispatch concurrently', async () => {
    const store = createStore();
    const r1 = store.dispatch(basicAsync());
    const r2 = store.dispatch(basicAsync());
    const r3 = store.dispatch(leadingAsync(1));
    const r4 = store.dispatch(leadingAsync(1));
    const r5 = store.dispatch(leadingAsync(2));
    expectCalled(basicFn, 2);
    expect(r1).not.toBe(r2);
    expectCalled(leadingFn, 2);
    expect(r4).toBe(r3);
    expect(r5).not.toBe(r3);
    expect(await Promise.all([r1, r2, r3, r4, r5])).toEqual([void 0, void 0, 1, 1, 2]);
    const r6 = store.dispatch(leadingAsync(1));
    store.dispatch(countBox.add(1));
    const r7 = store.dispatch(leadingAsync(1));
    expectCalled(leadingFn, 2);
    expect(r6).not.toBe(r3);
    expect(r7).not.toBe(r3);
    expect(r7).not.toBe(r6);
  });
});
