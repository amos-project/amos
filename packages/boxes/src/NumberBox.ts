/*
 * @since 2021-12-31 12:11:46
 * @author junbao <junbao@moego.pet>
 */

import { Box, implementation, Mutation } from 'amos-core';
import { NotImplemented } from 'amos-utils';

// should consider the method is selector and mutation at the same time.
// note: don't plan to deal with restricted types of scenarios, it should be the base box type.
export class NumberBox extends Box<number> {
  constructor(key: string, initialState: number = 0) {
    super(key, initialState);
  }

  add(value: number): Mutation<[number], number> {
    throw new NotImplemented();
  }

  minus(value: number): Mutation<[number], number> {
    throw new NotImplemented();
  }

  multiply(value: number): Mutation<[number], number> {
    throw new NotImplemented();
  }

  divide(value: number): Mutation<[number], number> {
    throw new NotImplemented();
  }

  mod(value: number): Mutation<[number], number> {
    throw new NotImplemented();
  }
}

implementation(
  NumberBox,
  {
    add: (state, value) => state + value,
    minus: (state, value) => state - value,
    multiply: (state, value) => state * value,
    divide: (state, value) => state / value,
    mod: (state, value) => state % value,
  },
  {},
);
