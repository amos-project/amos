/*
 * @since 2024-10-17 11:48:53
 * @author junbao <junbao@moego.pet>
 */

import { objectBox } from 'amos-boxes';
import { PersistOptions } from './types';

export interface PersistModel2 {
  options: PersistOptions | null;
  loading: Map<string, Promise<any>> | null;
}

export const persistBox = objectBox<PersistModel2>('amos.persist', {
  options: null,
  loading: null,
});
