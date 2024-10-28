/*
 * @since 2024-10-17 11:48:53
 * @author junbao <junbao@moego.pet>
 */

import {
  type Action,
  action,
  type ActionFactoryStatic,
  type Box,
  type Dispatch,
  type Select,
} from 'amos-core';
import { isAmosObject, NotImplemented, toArray } from 'amos-utils';
import type { PersistKey } from './types';

export interface HydrateState extends ActionFactoryStatic {
  <K extends PersistKey<any>[]>(...keys: K): Action<K, Promise<void>>;
}

export const hydrateState: HydrateState = action(
  async (dispatch: Dispatch, select: Select, ...keys: PersistKey<any>[]) => {
    throw new NotImplemented();
  },
  {
    conflictKey: (select: Select, ...keys: PersistKey<any>[]) => {
      return keys
        .map((k) => {
          return isAmosObject<Box>(k, 'box')
            ? [k.key]
            : toArray(k[1]).map((id) => k[0].key + ':' + id);
        })
        .flat();
    },
  },
) as HydrateState;
