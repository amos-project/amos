/*
 * @since 2024-10-26 11:19:11
 * @author junbao <junbao@moego.pet>
 */

import { isObject } from 'amos-utils';

export function toURLEncoded<T extends object>(obj: T, prefix?: string): string {
  const str = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      const value = obj[key];
      if (isObject(value)) {
        str.push(toURLEncoded(value, fullKey));
      } else {
        str.push(encodeURIComponent(fullKey) + '=' + encodeURIComponent(value as any));
      }
    }
  }
  return str.join('&');
}

export function composeSignal(signals: AbortSignal[]): AbortSignal | undefined {
  if (signals.length <= 1) {
    return signals[0];
  }
  const controller = new AbortController();
  for (const signal of signals) {
    signal.addEventListener('abort', () => {
      if (!controller.signal.aborted) {
        controller.abort(signal.reason);
      }
    });
  }
  return controller.signal;
}
