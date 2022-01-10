/*
 * @since 2021-12-31 12:11:46
 * @author junbao <junbao@moego.pet>
 */

import { Box } from 'amos-core';

// should consider the method is selector and mutation at the same time.
// note: don't plan to deal with restricted types of scenarios, it should be the base box type.
export class NumberBox extends Box<number> {
  add = this.mutation((state, value: number) => state + value, 'ADD');
  multiply = this.mutation((state, value: number) => state * value, 'MULTIPLY');

  constructor(key: string, initialState: number = 0) {
    super(key, initialState);
  }
}
