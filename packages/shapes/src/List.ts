/*
 * @since 2020-11-28 11:48:05
 * @author acrazing <joking.young@gmail.com>
 */

import { clone, Cloneable } from 'amos-utils';

const arr: any[] = [];

export class List<T> extends Cloneable {
  constructor(readonly data: readonly T[] = arr, isValid = data !== arr) {
    super(isValid);
  }

  fromJSON(state: readonly T[]): this {
    return clone(this, { data: state } as any);
  }

  toJSON(): readonly T[] {
    return this.data;
  }

  get(index: number) {
    return this.data[index];
  }

  size() {
    return this.data.length;
  }

  concat(...items: ConcatArray<T>[]): this {
    return this.make(this.data.concat(...items));
  }

  copyWithin(target: number, start: number, end?: number): this {
    return this.make(this.data.slice().copyWithin(target, start, end));
  }

  every(predicate: (value: T, index: number) => boolean): boolean {
    return this.data.every(predicate);
  }

  fill(value: T, start?: number, end?: number): this {
    return this.make(this.data.slice().fill(value, start, end));
  }

  filter(predicate: (value: T, index: number) => boolean): readonly T[] {
    return this.data.filter(predicate);
  }

  filterThis(predicate: (value: T, index: number) => boolean): this {
    return this.make(this.data.filter(predicate));
  }

  find(predicate: (value: T, index: number) => boolean): T | undefined {
    return this.data.find(predicate);
  }

  findIndex(predicate: (value: T, index: number) => boolean): number {
    return this.data.findIndex(predicate);
  }

  flat<D extends number = 1>(depth?: D): FlatArray<readonly T[], D>[] {
    return this.data.flat<readonly T[], D>(depth);
  }

  forEach(callbackfn: (value: T, index: number) => void): void {
    this.data.forEach(callbackfn);
  }

  includes(searchElement: T, fromIndex?: number): boolean {
    return this.data.includes(searchElement, fromIndex);
  }

  indexOf(searchElement: T, fromIndex?: number): number {
    return this.data.indexOf(searchElement, fromIndex);
  }

  join(separator?: string): string {
    return this.data.join(separator);
  }

  lastIndexOf(searchElement: T, fromIndex?: number): number {
    return this.data.lastIndexOf(searchElement, fromIndex);
  }

  map<U>(callbackfn: (value: T, index: number) => U): U[] {
    return this.data.map(callbackfn);
  }

  mapThis(callbackfn: (value: T, index: number) => T): this {
    return this.make(this.data.map(callbackfn));
  }

  pop(): this {
    const data = this.data.slice();
    data.pop();
    return this.make(data);
  }

  push(...items: T[]): this {
    const data = this.data.slice();
    data.push(...items);
    return this.make(data);
  }

  reduce<U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U,
    initialValue: U,
  ): U {
    return this.data.reduce(callbackfn, initialValue);
  }

  reduceRight<U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U,
    initialValue: U,
  ): U {
    return this.data.reduceRight(callbackfn, initialValue);
  }

  reverse(): this {
    return this.make(this.data.slice().reverse());
  }

  shift(): this {
    const data = this.data.slice();
    data.shift();
    return this.make(data);
  }

  slice(start?: number, end?: number): this {
    return this.make(this.data.slice(start, end));
  }

  some(predicate: (value: T, index: number) => boolean): boolean {
    return this.data.some(predicate);
  }

  sort(compareFn?: (a: T, b: T) => number): this {
    return this.make(this.data.slice().sort(compareFn));
  }

  splice(start: number, deleteCount: number, ...items: T[]): this {
    const data = this.data.slice();
    data.splice(start, deleteCount, ...items);
    return this.make(data);
  }

  delete(index: number): this {
    return this.splice(index, 1);
  }

  unshift(...items: T[]): this {
    const data = this.data.slice();
    data.unshift(...items);
    return this.make(data);
  }

  set(index: number, value: T): this {
    const data = this.data.slice();
    data[index] = value;
    return this.make(data);
  }

  private make(data: readonly T[]): this {
    return clone(this, { data } as any);
  }
}
