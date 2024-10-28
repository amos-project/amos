/*
 * @since 2024-10-17 20:04:24
 * @author junbao <junbao@moego.pet>
 */

import { type Select, selector } from 'amos-core';
import { dispatch, runMutations, select } from 'amos-testing';
import { objectBox } from './objectBox';

const objBox = objectBox('unit.box.obj', { foo: 'bar', bar: 1 });
const pickObj = selector(
  <K extends keyof (typeof objBox)['initialState']>(select: Select, ...keys: K[]) => {
    return select(objBox.pick(...keys));
  },
  {
    cache: true,
  },
);

describe('objectBox', () => {
  it('should create mutations', () => {
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
        objBox.set('foo', 'f2'),
        objBox.set('foo', 'bar'),
      ]),
    ).toEqual([
      { foo: 'baz', bar: 2 },
      { foo: 'bar', bar: 3 },
      void 0,
      { foo: 'bar', bar: 4 },
      { foo: 'bar', bar: 5 },
      { foo: 'f2', bar: 1 },
      void 0,
    ]);
  });
  it('should create selectors', () => {
    expect(select([objBox.get('foo'), objBox.pick('foo')])).toEqual(['bar', { foo: 'bar' }]);
    const foo = select(pickObj('foo'));
    expect(foo).toBe(select(pickObj('foo')));
    const fb = select(pickObj('foo', 'bar'));
    expect(fb).toBe(select(pickObj('foo', 'bar')));
    dispatch(objBox.set('foo', 'bar'));
    expect(foo).toBe(select(pickObj('foo')));
    dispatch(objBox.set('foo', 'baz'));
    expect(foo).not.toBe(select(pickObj('foo')));
    dispatch(objBox.set('foo', 'bar'));
    expect(foo).not.toBe(select(pickObj('foo')));
  });
});
