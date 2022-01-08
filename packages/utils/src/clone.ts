/*
 * @since 2022-01-06 18:51:21
 * @author junbao <junbao@moego.pet>
 */

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
  if (!obj || typeof obj !== 'object') {
    return props as T;
  }
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj, props);
}
