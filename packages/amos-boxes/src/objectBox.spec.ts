/*
 * @since 2024-10-17 20:04:24
 * @author junbao <junbao@moego.pet>
 */

import { runMutations } from 'amos-testing';
import { objectBox } from './objectBox';

const objBox = objectBox('unit.box.obj', { foo: 'bar', bar: 1 });

describe('objectBox', () => {
  it('should create object box', () => {
    objBox.mergeState({
      // @ts-expect-error
      baa: 3,
    });
    expect(
      runMutations(objBox.initialState, [
        objBox.setState({ foo: 'baz', bar: 2 }),
        objBox.mergeState({ bar: 3 }),
        objBox.setState(),
        objBox.setState((state) => ({ ...state, bar: state.bar * 4 })),
        objBox.mergeState((state) => ({ bar: state.bar * 5 })),
      ]),
    ).toEqual([
      { foo: 'baz', bar: 2 },
      { foo: 'bar', bar: 3 },
      void 0,
      { foo: 'bar', bar: 4 },
      { foo: 'bar', bar: 5 },
    ]);
  });
});
