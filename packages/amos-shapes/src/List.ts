/*
 * @since 2020-11-28 11:48:05
 * @author acrazing <joking.young@gmail.com>
 */

import { clone, Cloneable, JSONSerializable, JSONState, MustNever } from 'amos-utils';

export class List<E> extends Cloneable implements JSONSerializable<readonly E[]> {
  constructor(
    protected readonly defaultElement: E,
    protected readonly data: readonly E[] = [],
    isValid: boolean = false,
  ) {
    super(isValid);
  }

  fromJS(state: JSONState<readonly E[]>): this {
    return clone(this, { data: state.map((v) => clone(this.defaultElement, v as any)) } as any);
  }

  toJSON(): readonly E[] {
    return this.data;
  }

  get length() {
    return this.data.length;
  }

  // query

  getOrDefault(index: number): E {
    return this.data.length > index && index > -1 ? this.data[index] : this.defaultElement;
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
    return this.data.indexOf(searchElement, fromIndex);
  }

  lastIndexOf(searchElement: E, fromIndex?: number): number {
    return this.data.lastIndexOf(searchElement, fromIndex);
  }

  includes(searchElement: E, fromIndex?: number): boolean {
    return this.data.includes(searchElement, fromIndex);
  }

  some(predicate: (value: E, index: number) => boolean): boolean {
    return this.data.some(predicate);
  }

  every(predicate: (value: E, index: number) => boolean): boolean {
    return this.data.every(predicate);
  }

  forEach(callbackfn: (value: E, index: number) => void): void {
    this.data.forEach(callbackfn);
  }

  // move

  filter(predicate: (value: E, index: number) => boolean): readonly E[] {
    return this.data.filter(predicate);
  }

  filterThis(predicate: (value: E, index: number) => boolean): this {
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

  flat<D extends number = 1>(depth?: D): FlatArray<readonly E[], D>[] {
    return this.data.flat<readonly E[], D>(depth);
  }

  flatList<D extends number>(
    depth: D,
    defaultElement: FlatArray<readonly E[], D>,
  ): List<FlatArray<readonly E[], D>> {
    const data = this.data.flat<readonly E[], D>(depth);
    return new List<FlatArray<readonly E[], D>>(defaultElement, data);
  }

  map<U>(callbackfn: (value: E, index: number) => U): U[] {
    return this.data.map(callbackfn);
  }

  mapThis(callbackfn: (value: E, index: number) => E): this {
    return this.reset(this.data.map(callbackfn));
  }

  mapList<R>(defaultValue: R, callbackfn: (value: E, index: number) => R): List<R> {
    return new List<R>(defaultValue, this.data.map(callbackfn));
  }

  flatMap<U>(callbackfn: (value: E, index: number) => U | readonly U[]): U[] {
    return this.data.flatMap(callbackfn);
  }

  flatMapThis(callbackfn: (value: E, index: number) => E | readonly E[]): this {
    return this.reset(this.data.flatMap(callbackfn));
  }

  flatMapList<R>(
    defaultValue: R,
    callbackfn: (value: E, index: number) => R | readonly R[],
  ): List<R> {
    return new List<R>(defaultValue, this.data.flatMap(callbackfn));
  }

  slice(start?: number, end?: number): this {
    return this.reset(this.data.slice(start, end));
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

  entries(): IterableIterator<[number, E]> {
    return this.data.entries();
  }

  [Symbol.iterator](): IterableIterator<E> {
    return this.data[Symbol.iterator]();
  }
}

export type ListElement<L> = L extends List<infer E> ? E : never;

// check if List<T> implements all array methods
declare type MissedKeys = Exclude<
  keyof Array<any>,
  | number
  | 'toString'
  | 'toLocaleString'
  | 'keys'
  | 'values'
  | (typeof Symbol)['unscopables']
  | keyof List<any>
>;
declare type CheckMissedKeys = MustNever<MissedKeys>;
