/*
 * @since 2021-12-31 11:59:54
 * @author junbao <junbao@moego.pet>
 */

import { Box, BoxOptions } from 'amos-core';

export class BoolBox extends Box<boolean> {
  toggle = this.mutation((state) => !state, 'TOGGLE');
  open = this.mutation(() => true, 'OPEN');
  close = this.mutation(() => false, 'CLOSE');

  constructor(key: string, initialState: boolean = false, options?: BoxOptions<boolean>) {
    super(key, initialState, options);
  }
}
