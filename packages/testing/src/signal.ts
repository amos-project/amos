/*
 * @since 2021-01-19 23:30:47
 * @author acrazing <joking.young@gmail.com>
 */

import { signal } from 'amos';

export interface ResetEvent {
  count: number;
}

export const reset = signal('RESET', (count: number): ResetEvent => ({ count }));
