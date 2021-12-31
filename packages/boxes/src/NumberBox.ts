/*
 * @since 2021-12-31 12:11:46
 * @author junbao <junbao@moego.pet>
 */

import { Box, BoxOptions, MutationFactory } from 'amos-core';

export interface NumberBox extends Box<number> {
  add: MutationFactory<[number], number>;
  multiply: MutationFactory<[number], number>;
}

// should consider the method is selector and mutation at the same time.
// note: don't plan to deal with restricted types of scenarios, it should be the base box type.
export function createNumberBox(initialState = 0, options?: BoxOptions<number>): NumberBox {
  const box = new Box(initialState, options);
  return Object.assign(box, {
    add: box.mutation((state, value: number) => state + value, 'ADD'),
    multiply: box.mutation((state, value: number) => state * value, 'MULTIPLY'),
  });
}
