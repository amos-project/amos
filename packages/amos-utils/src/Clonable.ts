/*
 * @since 2022-01-06 18:51:21
 * @author junbao <junbao@moego.pet>
 */

import { WellPartial } from './types';

/**
 * Cloneable object is used to detect the current object is cloned from initial object or not.
 */
export class Cloneable {
  private _isValid: boolean | undefined;

  constructor(isValid: boolean) {
    Object.defineProperty(this, '_isValid', { value: isValid });
  }

  /**
   * Is this object derived from other object?
   * {@link clone} will skip {@link _isValid} property, then is value will be true.
   * This is helpful for valid if target object is changed or not.
   */
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
export function clone<T>(obj: T, props: WellPartial<T>): T {
  if (!obj || typeof obj !== 'object') {
    return props as T;
  }
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj, props);
}

/**
 * Create an object with null proto, and merge values to it.
 * @param values
 */
export function nullObject<T>(...values: T[]): T {
  return Object.assign(Object.create(null), ...values);
}
