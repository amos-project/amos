/*
 * @since 2020-11-04 10:57:59
 * @author acrazing <joking.young@gmail.com>
 */

import { action } from './action';
import { mergeTest } from './box.spec';
import { selectCount } from './selector.spec';

export const dummyFetch = <T>(input: T) => Promise.resolve(input);

export const addGreet = action(
  (dispatch, select, greet: string) =>
    dummyFetch(greet).then((greet) =>
      dispatch(mergeTest({ greets: [greet], count: selectCount(select) + 1 })),
    ),
  'ADD_GREET',
);

describe('action', () => {
  it('should create action', () => {
    const { actor, ...other } = addGreet('hello world');
    expect(other).toEqual({
      type: 'ADD_GREET',
      args: ['hello world'],
      object: 'action',
      options: {},
    });
    expect(typeof actor).toBe('function');
  });
});
