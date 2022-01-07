/*
 * @since 2022-01-06 18:51:01
 * @author junbao <junbao@moego.pet>
 */

export class OSet<T extends keyof any = string> {
  private data: Record<T, true> = {} as Record<T, true>;

  constructor(values: readonly T[] = []) {
    values.forEach((v) => this.add(v));
  }

  empty() {
    for (const _value in this.data) {
      return false;
    }
    return true;
  }

  add(value: T) {
    this.data[value] = true;
  }

  delete(value: T) {
    delete this.data[value];
  }

  clear() {
    this.data = {} as Record<T, true>;
  }

  has(value: T) {
    return this.data.hasOwnProperty(value);
  }

  forEach(fn: (value: T extends string ? T : string) => void) {
    for (const value in this.data) {
      if (this.data.hasOwnProperty(value)) {
        fn(value);
      }
    }
  }

  some(fn: (value: T extends string ? T : string) => boolean): boolean {
    for (const value in this.data) {
      if (this.data.hasOwnProperty(value)) {
        if (fn(value)) {
          return true;
        }
      }
    }
    return false;
  }

  every(fn: (value: T extends string ? T : string) => boolean): boolean {
    for (const value in this.data) {
      if (this.data.hasOwnProperty(value)) {
        if (!fn(value)) {
          return false;
        }
      }
    }
    return true;
  }
}
