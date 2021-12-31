/*
 * @since 2021-12-31 11:59:54
 * @author junbao <junbao@moego.pet>
 */

import { Box, BoxOptions, MutationFactory } from 'amos-core';

export interface BoolBox extends Box<boolean> {
  /**
   * Toggle the value
   */
  toggle: MutationFactory<[], boolean>;
  /**
   * Set value to true
   */
  open: MutationFactory<[], boolean>;
  /**
   * Set value to false
   */
  close: MutationFactory<[], boolean>;
}

export function createBoolBox(initialState = false, options?: BoxOptions<boolean>): BoolBox {
  const box = new Box(initialState, options);
  return Object.assign(box, {
    toggle: box.mutation((state) => !state, 'TOGGLE'),
    open: box.mutation(() => true, 'OPEN'),
    close: box.mutation(() => false, 'CLOSE'),
  });
}
