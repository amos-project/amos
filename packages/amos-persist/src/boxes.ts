/*
 * @since 2024-10-17 11:48:53
 * @author junbao <junbao@moego.pet>
 */

import { box } from 'amos-core';
import { PersistOptions } from './types';

export interface PersistState {
  options: PersistOptions;
  hydrating: Map<string, Promise<void>>;
  persisted: Record<string, unknown>;
  persisting: Map<string, Promise<void>>;
}

export const persistBox = box<PersistState | null>('amos.persist', null);
