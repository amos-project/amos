/*
 * @since 2020-11-28 11:48:05
 * @author acrazing <joking.young@gmail.com>
 */

import { clone, Cloneable, JSONSerializable, JSONState } from 'amos-utils';

export class List<E> extends Cloneable implements JSONSerializable<readonly E[]> {
  protected readonly data: readonly E[] = [];

  constructor(protected readonly defaultElement: E, isValid: boolean = false) {
    super(isValid);
  }

  fromJSON(state: JSONState<readonly E[]>): this {
    return clone(this, { data: state.map((v) => clone(this.defaultElement, v as any)) } as any);
  }

  toJSON(): readonly E[] {
    return this.data;
  }

  get(index: number) {
    return this.data[index];
  }

  size() {
    return this.data.length;
  }

  concat(...items: ConcatArray<E>[]): this {
    return this.reset(this.data.concat(...items));
  }

  copyWithin(target: number, start: number, end?: number): this {
    return this.reset(this.data.slice().copyWithin(target, start, end));
  }

  every(predicate: (value: E, index: number) => boolean): boolean {
    return this.data.every(predicate);
  }

  fill(value: E, start?: number, end?: number): this {
    return this.reset(this.data.slice().fill(value, start, end));
  }

  filter(predicate: (value: E, index: number) => boolean): readonly E[] {
    return this.data.filter(predicate);
  }

  filterThis(predicate: (value: E, index: number) => boolean): this {
    return this.reset(this.data.filter(predicate));
  }

  find(predicate: (value: E, index: number) => boolean): E | undefined {
    return this.data.find(predicate);
  }

  findIndex(predicate: (value: E, index: number) => boolean): number {
    return this.data.findIndex(predicate);
  }

  flat<D extends number = 1>(depth?: D): FlatArray<readonly E[], D>[] {
    return this.data.flat<readonly E[], D>(depth);
  }

  forEach(callbackfn: (value: E, index: number) => void): void {
    this.data.forEach(callbackfn);
  }

  includes(searchElement: E, fromIndex?: number): boolean {
    return this.data.includes(searchElement, fromIndex);
  }

  indexOf(searchElement: E, fromIndex?: number): number {
    return this.data.indexOf(searchElement, fromIndex);
  }

  join(separator?: string): string {
    return this.data.join(separator);
  }

  lastIndexOf(searchElement: E, fromIndex?: number): number {
    return this.data.lastIndexOf(searchElement, fromIndex);
  }

  map<U>(callbackfn: (value: E, index: number) => U): U[] {
    return this.data.map(callbackfn);
  }

  mapThis(callbackfn: (value: E, index: number) => E): this {
    return this.reset(this.data.map(callbackfn));
  }

  pop(): this {
    const data = this.data.slice();
    data.pop();
    return this.reset(data);
  }

  push(...items: E[]): this {
    const data = this.data.slice();
    data.push(...items);
    return this.reset(data);
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

  reverse(): this {
    return this.reset(this.data.slice().reverse());
  }

  shift(): this {
    const data = this.data.slice();
    data.shift();
    return this.reset(data);
  }

  slice(start?: number, end?: number): this {
    return this.reset(this.data.slice(start, end));
  }

  some(predicate: (value: E, index: number) => boolean): boolean {
    return this.data.some(predicate);
  }

  sort(compareFn?: (a: E, b: E) => number): this {
    return this.reset(this.data.slice().sort(compareFn));
  }

  splice(start: number, deleteCount: number, ...items: E[]): this {
    const data = this.data.slice();
    data.splice(start, deleteCount, ...items);
    return this.reset(data);
  }

  delete(index: number): this {
    return this.splice(index, 1);
  }

  unshift(...items: E[]): this {
    const data = this.data.slice();
    data.unshift(...items);
    return this.reset(data);
  }

  set(index: number, value: E): this {
    const data = this.data.slice();
    data[index] = value;
    return this.reset(data);
  }

  reset(data: readonly E[]): this {
    return clone(this, { data } as any);
  }
}

export type ListElem<L> = L extends List<infer E> ? E : never;
