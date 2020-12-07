/*
 * @since 2020-11-04 10:25:48
 * @author acrazing <joking.young@gmail.com>
 */

import { Box } from './box';
import { reset } from './signal.spec';

export class UserModel {
  readonly id: number = 0;
  readonly avatarPath: string = '';
  readonly firstName: string = '';
  readonly lastName: string = '';

  merge(props: Partial<UserModel>): this {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this, props);
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const userBox = new Box('users/current', new UserModel());

export const mergeUser = userBox.mutation((state, props: Partial<UserModel>) => state.merge(props));

export const countBox = new Box('count', 0);
countBox.listen(reset, (state, data) => data.count);

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

export const incrCount = countBox.mutation((state) => state + 1);
export const addCount = countBox.mutation(
  (state, action: number = 1) => state + action,
  'ADD_COUNT',
);

describe('mutation', () => {
  it('should create mutation', () => {
    const mutation = addCount();
    expect(mutation.box).toBe(countBox);
    expect(mutation.type).toBe('ADD_COUNT');
    expect(mutation.mutator(1, 2)).toEqual(3);
  });
});
