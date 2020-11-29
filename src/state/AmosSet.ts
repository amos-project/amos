/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

export class AmosSet<T> implements Set<T> {
  private readonly data: Set<T>;

  constructor() {}
  add(value: T): this {}

  clear(): void {}

  delete(value: T): boolean {
    return false;
  }

  entries(): IterableIterator<[T, T]> {
    return undefined;
  }

  forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {}

  has(value: T): boolean {
    return false;
  }

  keys(): IterableIterator<T> {
    return undefined;
  }

  values(): IterableIterator<T> {
    return undefined;
  }
}
