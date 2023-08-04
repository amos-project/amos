/*
 * @since 2021-12-31 11:59:54
 * @author junbao <junbao@moego.pet>
 */

import { createBoxFactory, Mutation, ShapedBox } from 'amos-core';

export interface BoolBox extends ShapedBox<boolean, never, never> {
  toggle(): Mutation<[], boolean>;
  open(): Mutation<[], boolean>;
  close(): Mutation<[], boolean>;
}

export const BoolBox = createBoxFactory<BoolBox>({
  name: 'BoolBox',
  defaultInitialState: false,
  mutations: {
    toggle: (state) => !state,
    open: () => true,
    close: () => false,
  },
  selectors: {},
});
