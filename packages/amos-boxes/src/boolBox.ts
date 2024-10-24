/*
 * @since 2021-12-31 11:59:54
 * @author junbao <junbao@moego.pet>
 */

import { Box, Mutation } from 'amos-core';

export interface BoolBox extends Box<boolean> {
  toggle(): Mutation<boolean>;
  open(): Mutation<boolean>;
  close(): Mutation<boolean>;
}

export const BoolBox = Box.extends<BoolBox>({
  name: 'BoolBox',
  mutations: {
    toggle: (state) => !state,
    open: () => true,
    close: () => false,
  },
  selectors: {},
});

export function boolBox(key: string, initialState = false) {
  return new BoolBox(key, initialState);
}
