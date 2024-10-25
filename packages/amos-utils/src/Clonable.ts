/*
 * @since 2022-01-06 18:51:21
 * @author junbao <junbao@moego.pet>
 */

import { isObject } from './equals';
import { WellPartial } from './types';

/**
 * Cloneable object is used to detect the current object is cloned from initial object or not.
 */
export class Cloneable {
  private _isInitial: boolean | undefined;

  constructor(isInitial: boolean) {
    Object.defineProperty(this, '_isInitial', {
      value: isInitial,
      configurable: false,
      writable: false,
      enumerable: false,
    });
  }

  /**
   * Is this object derived from other object?
   * {@link clone} will skip {@link _isInitial} property, then this value will be true.
   * This is helpful for valid if target object is changed or not.
   */
  isInitial() {
    return this._isInitial === true;
  }
}

/**
 * copy an object with prototype and override properties.
 *
 * @param obj - the object to be cloned.
 * @param props - the properties to override.
 */
export function clone<T>(obj: T, props: WellPartial<T>): T {
  if (!isObject(obj) || !isObject(props)) {
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
