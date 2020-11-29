/*
 * @since 2020-11-05 15:24:04
 * @author acrazing <joking.young@gmail.com>
 */

import { signal } from './signal';

export interface ResetEvent {
  count: number;
}

export const reset = signal('RESET', (count: number): ResetEvent => ({ count }));

describe('event', () => {
  it('should create event', () => {
    expect(typeof reset).toBe('function');
    expect(reset.type).toBe('RESET');
    expect(reset(1)).toEqual({
      object: 'signal',
      type: 'RESET',
      data: { count: 1 },
    });
  });
});
