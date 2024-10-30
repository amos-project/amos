/*
 * @since 2020-11-04 10:25:48
 * @author acrazing <joking.young@gmail.com>
 */

import { mapBox } from 'amos-boxes';
import { applyMutations, countBox, sessionIdBox, todoMapBox } from 'amos-testing';
import { Box } from './box';
import { createStore } from './store';

describe('Box', () => {
  it('should implement mutations', () => {
    expect(
      applyMutations(sessionIdBox.initialState, [
        sessionIdBox.setState(2),
        sessionIdBox.setState(),
        sessionIdBox.setState((state) => state + 4),
        sessionIdBox.setState((state) => state * 5),
      ]),
    ).toEqual([2, 0, 4, 20]);
    expect(
      applyMutations(1, [
        countBox.add(10),
        countBox.minus(5),
        countBox.multiply(3),
        countBox.divide(6),
        countBox.mod(2),
        countBox.setState((state) => state + 11),
        countBox.setState(10),
        countBox.setState(),
      ]),
    ).toEqual([11, 6, 18, 3, 1, 12, 10, countBox.initialState]);
  });
  it('should implement selectors', () => {
    const store = createStore();
    expect([
      store.select(countBox.toFixed(2)),
      store.dispatch(countBox.setState(2)),
      store.select(countBox.toExponential(2)),
      store.select(todoMapBox.getItem(1)).toJSON().id,
      store.dispatch(todoMapBox.mergeItem(1, {})).getItem(1).id,
      store.select(todoMapBox.getItem(1)).toJSON().id,
      todoMapBox.getItem(1).loadRow?.(1),
    ]).toEqual([
      countBox.initialState.toFixed(2),
      2,
      (2).toExponential(2),
      0,
      1,
      1,
      [todoMapBox, 1],
    ]);
  });
  it('should implement options', () => {
    expect([
      todoMapBox.table?.toRows(todoMapBox.initialState),
      countBox.table?.toRows(0),
      mapBox('m1', 1, 1).config({ table: void 0 }).table,
      mapBox('m2', 1, 1).table === todoMapBox.table,
      !!todoMapBox.table,
    ]).toEqual([{}, void 0, void 0, true, true]);
  });
  it('should implement methods', () => {
    const MyBox = Box.extends<Box & { foo(): number }>({
      name: 'My',
      mutations: {},
      selectors: {},
      methods: { foo: () => 1 },
    });
    expect([
      new MyBox('my', '').foo(),
      Object.hasOwn(Box.prototype, 'foo'),
      Object.hasOwn(MyBox.prototype, 'foo'),
    ]).toEqual([1, false, true]);
  });
});
