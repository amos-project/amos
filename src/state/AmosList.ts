/*
 * @since 2020-11-28 11:48:05
 * @author acrazing <joking.young@gmail.com>
 */

import { JSONSerializable, JSONState } from '../core/types';
import { clone } from '../core/utils';
import { createBoxFactory } from './createBoxFactory';
import { fork, forkable } from './utils';

@forkable
export class AmosList<T> implements JSONSerializable<T[]> {
  constructor(readonly data: T[] = []) {}

  fromJSON(state: JSONState<T[]>): this {
    return clone(this, { data: state as T[] } as Partial<this>);
  }

  toJSON(): T[] {
    return this.data;
  }

  size() {
    return this.data.length;
  }

  concat(other: readonly T[]): this {
    return clone(this, { data: this.data.concat(other) } as Partial<this>);
  }

  every(predicate: (value: T, index: number, array: T[]) => unknown): boolean {
    return this.data.every(predicate);
  }

  filter(predicate: (value: T, index: number, array: T[]) => unknown): this {
    return clone(this, { data: this.data.filter(predicate) } as Partial<this>);
  }

  find(predicate: (value: T, index: number, obj: T[]) => unknown): T | undefined {
    return this.data.find(predicate);
  }

  findIndex(predicate: (value: T, index: number, obj: T[]) => unknown): number {
    return this.data.findIndex(predicate);
  }

  forEach(callbackFn: (value: T, index: number, array: T[]) => void): void {
    this.data.forEach(callbackFn);
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

  map<U>(callbackFn: (value: T, index: number, array: T[]) => U): U[] {
    return this.data.map(callbackFn);
  }

  mapThis(callbackFn: (value: T, index: number, array: T[]) => T): this {
    return clone(this, { data: this.data.map(callbackFn) } as Partial<this>);
  }

  pop(): this {
    this.data.pop();
    return fork(this);
  }

  push(...items: T[]): this {
    this.data.push(...items);
    return fork(this);
  }

  reduce<U>(
    callbackFn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
    initialValue: U,
  ): U {
    return this.data.reduce(callbackFn, initialValue);
  }

  reduceRight<U>(
    callbackFn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
    initialValue: U,
  ): U {
    return this.data.reduceRight(callbackFn, initialValue);
  }

  reverse(): this {
    this.data.reverse();
    return fork(this);
  }

  shift(): this {
    this.data.shift();
    return fork(this);
  }

  slice(start?: number, end?: number): this {
    return clone(this, { data: this.data.slice(start, end) } as Partial<this>);
  }

  some(predicate: (value: T, index: number, array: T[]) => unknown): boolean {
    return this.data.some(predicate);
  }

  sort(compareFn?: (a: T, b: T) => number): this {
    this.data.sort(compareFn);
    return fork(this);
  }

  splice(start: number, deleteCount = 0, ...items: T[]): this {
    this.data.splice(start, deleteCount, ...items);
    return fork(this);
  }

  unshift(...items: T[]): this {
    this.data.unshift(...items);
    return fork(this);
  }

  set(index: number, value: T): this {
    this.data[index] = value;
    return fork(this);
  }

  delete(value: T): this {
    const index = this.data.indexOf(value);
    return index === -1 ? this : this.splice(index, 1);
  }
}

export const createListBox = createBoxFactory(
  AmosList,
  {
    delete: true,
    set: true,
    unshift: true,
    splice: true,
    sort: true,
    slice: true,
    shift: true,
    reverse: true,
    push: true,
    pop: true,
    mapThis: true,
    concat: true,
  },
  {
    some: true,
    reduceRight: true,
    reduce: true,
    map: true,
    lastIndexOf: true,
    join: true,
    indexOf: true,
    includes: true,
    findIndex: true,
    find: true,
    filter: true,
    every: true,
    size: false,
  },
);
