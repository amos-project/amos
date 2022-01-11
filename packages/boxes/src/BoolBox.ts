/*
 * @since 2021-12-31 11:59:54
 * @author junbao <junbao@moego.pet>
 */

import { Box, implementation, Mutation } from 'amos-core';
import { NotImplemented } from 'amos-utils';

export class BoolBox extends Box<boolean> {
  constructor(key: string, initialState: boolean = false) {
    super(key, initialState);
  }

  toggle(): Mutation<[], boolean> {
    throw new NotImplemented();
  }

  open(): Mutation<[], boolean> {
    throw new NotImplemented();
  }

  close(): Mutation<[], boolean> {
    throw new NotImplemented();
  }
}

implementation(
  BoolBox,
  {
    toggle: (state: boolean) => !state,
    open: () => true,
    close: () => false,
  },
  {},
);
