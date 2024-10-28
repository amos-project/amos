/*
 * @since 2020-11-28 11:48:05
 * @author acrazing <joking.young@gmail.com>
 */

import {
  arrayEqual,
  clone,
  Cloneable,
  isArray,
  isIterable,
  JSONSerializable,
  JSONState,
  MustNever,
} from 'amos-utils';

export class List<E> extends Cloneable implements JSONSerializable<readonly E[]> {
  protected readonly data: readonly E[];

  constructor(data?: ArrayLike<E> | Iterable<E>, isInitial?: boolean) {
    const items = isArray(data) ? data : isIterable(data) ? Array.from(data) : [];
    super(isInitial ?? !items.length);
    this.data = items;
  }

  get length() {
    return this.data.length;
  }

  fromJS(state: JSONState<readonly E[]>): this {
    return clone(this, { data: state } as any);
  }

  toJSON(): readonly E[] {
    return this.data;
  }

  // query

  has(index: number): boolean {
    return index > -1 && this.data.length > index;
  }

  get(index: number): E | undefined {
    return this.data[index];
  }

  at(index: number): E | undefined {
    return this.data.at(index);
  }

  find(predicate: (value: E, index: number) => boolean): E | undefined {
    return this.data.find(predicate);
  }

  findIndex(predicate: (value: E, index: number) => boolean): number {
    return this.data.findIndex(predicate);
  }

  indexOf(searchElement: E, fromIndex?: number): number {
    return this.data.indexOf(...(arguments as unknown as [E]));
  }

  lastIndexOf(searchElement: E, fromIndex?: number): number {
    return this.data.lastIndexOf(...(arguments as unknown as [E]));
  }

  includes(searchElement: E, fromIndex?: number): boolean {
    return this.data.includes(...(arguments as unknown as [E, number]));
  }

  some(predicate: (value: E, index: number) => boolean): boolean {
    return this.data.some(predicate);
  }

  every(predicate: (value: E, index: number) => boolean): boolean {
    return this.data.every(predicate);
  }

  forEach(callbackfn: (value: E, index: number, list: this) => void): void {
    this.data.forEach((v, i) => callbackfn(v, i, this));
  }

  // move

  filter(predicate: (value: E, index: number) => boolean): this {
    return this.reset(this.data.filter(predicate));
  }

  join(separator?: string): string {
    return this.data.join(separator);
  }

  reduce<U>(
    callbackfn: (previousValue: U, currentValue: E, currentIndex: number) => U,
    initialValue: U,
  ): U {
    return this.data.reduce(callbackfn, initialValue);
  }

  reduceRight<U>(
    callbackfn: (previousValue: U, currentValue: E, currentIndex: number) => U,
    initialValue: U,
  ): U {
    return this.data.reduceRight(callbackfn, initialValue);
  }

  flat<D extends number = 1>(depth?: D): List<FlatArray<readonly E[], D>> {
    const data = this.data.flat<readonly E[], D>(...arguments);
    return new List<FlatArray<readonly E[], D>>(data);
  }

  map<R>(callbackfn: (value: E, index: number) => R): List<R> {
    return new List<R>(this.data.map(callbackfn));
  }

  flatMap<R>(callbackfn: (value: E, index: number) => R | readonly R[]): List<R> {
    return new List<R>(this.data.flatMap(callbackfn));
  }

  slice(start?: number, end?: number): this {
    return this.reset(this.data.slice(...arguments));
  }

  // update

  shift(): this {
    const data = this.data.slice();
    data.shift();
    return this.reset(data);
  }

  unshift(...items: E[]): this {
    const data = this.data.slice();
    data.unshift(...items);
    return this.reset(data);
  }

  push(...items: E[]): this {
    const data = this.data.slice();
    data.push(...items);
    return this.reset(data);
  }

  pop(): this {
    const data = this.data.slice();
    data.pop();
    return this.reset(data);
  }

  concat(...items: ConcatArray<E>[]): this {
    return this.reset(this.data.concat(...items));
  }

  copyWithin(target: number, start: number, end?: number): this {
    return this.reset(this.data.slice().copyWithin(target, start, end));
  }

  fill(value: E, start?: number, end?: number): this {
    return this.reset(this.data.slice().fill(value, start, end));
  }

  reverse(): this {
    return this.reset(this.data.slice().reverse());
  }

  sort(compareFn?: (a: E, b: E) => number): this {
    return this.reset(this.data.slice().sort(compareFn));
  }

  splice(start: number, deleteCount: number, ...items: E[]): this {
    const data = this.data.slice();
    data.splice(start, deleteCount, ...items);
    return this.reset(data);
  }

  set(index: number, value: E): this {
    if (this.get(index) === value) {
      return this;
    }
    const data = this.data.slice();
    data[index] = value;
    return this.reset(data);
  }

  delete(item: E): this {
    const index = this.data.indexOf(item);
    return index === -1 ? this : this.splice(index, 1);
  }

  reset(data: readonly E[]): this {
    return clone(this, { data } as any);
  }

  // iterators

  entries(): ArrayIterator<[number, E]> {
    return this.data.entries();
  }

  keys(): ArrayIterator<number> {
    return this.data.keys();
  }

  values(): ArrayIterator<E> {
    return this.data.values();
  }

  [Symbol.iterator](): ArrayIterator<E> {
    return this.data[Symbol.iterator]();
  }
}

export type ListElement<L> = L extends List<infer E> ? E : never;

// check if List<T> implements all array methods
declare type MissedKeys = Exclude<
  keyof Array<any>,
  number | 'toString' | 'toLocaleString' | (typeof Symbol)['unscopables'] | keyof List<any>
>;
declare type CheckMissedKeys = MustNever<MissedKeys>;

export function isSameList<T>(a: List<T> | readonly T[], b: List<T> | readonly T[]): boolean {
  if (a === b) {
    return true;
  }
  const aa = a instanceof List ? a.toJSON() : a;
  const ab = b instanceof List ? b.toJSON() : b;
  return arrayEqual(aa, ab);
}
