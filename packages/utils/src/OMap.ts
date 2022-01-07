/*
 * @since 2022-01-06 18:50:43
 * @author junbao <junbao@moego.pet>
 */

import { threw } from './misc';

export class OMap<V, K extends keyof any = string> {
  private data: Record<K, V> = {} as Record<K, V>;

  set(key: K, value: V) {
    this.data[key] = value;
  }

  delete(key: K) {
    delete this.data[key];
  }

  clear() {
    this.data = {} as Record<K, V>;
  }

  has(key: K) {
    return this.data.hasOwnProperty(key);
  }

  get(key: K): V | undefined {
    return this.data[key];
  }

  take(key: K): V {
    if (process.env.NODE_ENV === 'development') {
      threw(!this.has(key), `Cannot get non-existent key ${key}.`);
    }
    return this.data[key];
  }

  some(fn: (value: V, key: K extends string ? K : string) => boolean): boolean {
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        if (fn(this.data[key], key)) {
          return true;
        }
      }
    }
    return false;
  }

  every(fn: (value: V, key: K extends string ? K : string) => boolean): boolean {
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        if (!fn(this.data[key], key)) {
          return false;
        }
      }
    }
    return true;
  }
}
