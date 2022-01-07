/*
 * @since 2022-01-06 18:51:21
 * @author junbao <junbao@moego.pet>
 */

import { threw, warning } from './misc';

export class Cloneable {
  private _isValid: boolean | undefined;

  constructor(isValid: boolean) {
    Object.defineProperty(this, '_isValid', { value: isValid });
  }

  isValid() {
    return this._isValid !== false;
  }
}

/**
 * copy an object with prototype and override properties.
 *
 * @param obj - the object to be cloned.
 * @param props - the properties to override.
 */
export function clone<T>(obj: T, props: Partial<T>): T {
  if (process.env.NODE_ENV === 'development') {
    threw(typeof obj !== 'object' || !obj, `primitive object cannot be cloned.`);
    for (const key in obj) {
      if ((obj as any).hasOwnProperty(key)) {
        const value = obj[key];
        warning(
          typeof value === 'function' && !value.prototype,
          `Bound function ${key} is detected, and it may not be cloned properly.`,
        );
      }
    }
  }
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj, props);
}
