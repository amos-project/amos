/*
 * @since 2020-11-04 10:25:48
 * @author acrazing <joking.young@gmail.com>
 */

import { Box } from './box';
import { applyMutation } from './internals';

const intBox = new Box('unit.box.int', 1);
const objBox = new Box('unit.box.obj', { foo: 'bar', bar: 1 });

describe('Box', function () {
  it('should implement mutations', function () {
    expect(
      [
        intBox.setState(2),
        intBox.mergeState(3),
        intBox.resetState(),
        intBox.setState((state) => state * 4),
        intBox.mergeState((state) => state * 5),
      ].reduce(
        (prev, now) => {
          prev.push(applyMutation(prev[prev.length - 1], now));
          return prev;
        },
        [intBox.initialState],
      ),
    ).toEqual([1, 2, 3, 1, 4, 20]);
    expect(
      [
        objBox.setState({ foo: 'baz', bar: 2 }),
        objBox.mergeState({ bar: 3 }),
        objBox.resetState(),
        objBox.setState((state) => ({ ...state, bar: state.bar * 4 })),
        objBox.mergeState((state) => ({ bar: state.bar * 5 })),
      ].reduce(
        (prev, now) => {
          prev.push(applyMutation(prev[prev.length - 1], now));
          return prev;
        },
        [objBox.initialState],
      ),
    ).toEqual([
      { foo: 'bar', bar: 1 },
      { foo: 'baz', bar: 2 },
      { foo: 'baz', bar: 3 },
      { foo: 'bar', bar: 1 },
      { foo: 'bar', bar: 4 },
      { foo: 'bar', bar: 20 },
    ]);
  });
});
