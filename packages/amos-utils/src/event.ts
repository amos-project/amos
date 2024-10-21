/*
 * @since 2024-10-17 11:25:40
 * @author junbao <junbao@moego.pet>
 */

import { Unsubscribe } from './types';

export interface EventCenter<A extends any[]> {
  dispatch: (...args: A) => void;
  subscribe: (handler: (...args: A) => void) => Unsubscribe;
}

export function createEventCenter<A extends any[]>(): EventCenter<A> {
  const listeners: Set<(...args: A) => void> = new Set();
  const dispatch = (...args: A) => {
    listeners.forEach((fn) => fn(...args));
  };
  const subscribe = (handler: (...args: A) => void) => {
    listeners.add(handler);
    return () => listeners.delete(handler);
  };
  return { dispatch, subscribe };
}
