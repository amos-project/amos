/*
 * @since 2021-12-31 12:11:46
 * @author junbao <junbao@moego.pet>
 */

import { Box, Mutation, ShapeBox } from 'amos-core';

// should consider the method is selector and mutation at the same time.
// note: don't plan to deal with restricted types of scenarios, it should be the base box type.
export interface NumberBox
  extends Box<number>,
    ShapeBox<number, never, 'toExponential' | 'toFixed'> {
  add(value: number): Mutation<number>;
  minus(value: number): Mutation<number>;
  multiply(value: number): Mutation<number>;
  divide(value: number): Mutation<number>;
  mod(value: number): Mutation<number>;
}

export const NumberBox = Box.extends<NumberBox>({
  name: 'NumberBox',
  mutations: {
    add: (state, value) => state + value,
    minus: (state, value) => state - value,
    multiply: (state, value) => state * value,
    divide: (state, value) => state / value,
    mod: (state, value) => state % value,
  },
  selectors: {
    toExponential: null,
    toFixed: null,
  },
});

export function numberBox(key: string, initialState = 0): NumberBox {
  return new NumberBox(key, initialState);
}
