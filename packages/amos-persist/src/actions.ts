/*
 * @since 2024-10-17 11:48:53
 * @author junbao <junbao@moego.pet>
 */

import { Action, action, Box, Dispatch, MapSelectables, Select } from 'amos-core';
import { NotImplemented } from 'amos-utils';

export interface LoadBoxes {
  <A extends Box[]>(...boxes: A): Action<A, Promise<MapSelectables<A>>>;
}

export const loadBoxes: LoadBoxes = action(
  async <A extends Box[]>(dispatch: Dispatch, select: Select, ...boxes: A) => {
    throw new NotImplemented();
  },
  {},
);
