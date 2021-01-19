/*
 * @since 2020-11-04 10:25:48
 * @author acrazing <joking.young@gmail.com>
 */

import { addCount, countBox, reset } from '@kcats/testing';

describe('box', () => {
  it('should create box', () => {
    expect(countBox.key).toBe('count');
    expect(countBox.initialState).toEqual(0);
    expect(countBox.preload(1, countBox.initialState)).toEqual(1);
  });
  it('should listen signal', () => {
    expect(typeof countBox.listeners[reset.type]).toBe('function');
  });
});

describe('mutation', () => {
  it('should create mutation', () => {
    const mutation = addCount();
    expect(mutation.box).toBe(countBox);
    expect(mutation.type).toBe('ADD_COUNT');
    expect(mutation.mutator(1, 2)).toEqual(3);
  });
});
