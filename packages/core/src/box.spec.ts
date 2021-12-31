/*
 * @since 2020-11-04 10:25:48
 * @author acrazing <joking.young@gmail.com>
 */

import { addCount, countBox, reset } from 'amos-testing';
import { Box } from './box';
import { fromJSON } from '../../utils/src/utils';

describe('box', () => {
  it('should create box', () => {
    expect(countBox).toEqual(
      Object.assign(Object.create(Box.prototype), {
        key: 'count',
        initialState: 0,
        listeners: {
          [reset.type]: expect.any(Function),
        },
        preload: fromJSON,
        setState: expect.any(Function),
        mergeState: expect.any(Function),
      }),
    );
  });
  it('should listen signal', () => {
    expect(typeof countBox.signals[reset.type]).toBe('function');
  });
});

describe('mutation', () => {
  it('should create mutation factory', () => {
    expect({ ...addCount }).toEqual({
      $object: 'mutation_factory',
      type: 'ADD_COUNT',
      box: countBox,
      mutator: expect.any(Function),
    });
  });
  it('should create mutation', () => {
    expect(addCount()).toEqual({
      $object: 'mutation',
      args: [],
      factory: addCount,
    });
  });
});
