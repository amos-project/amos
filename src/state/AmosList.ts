/*
 * @since 2020-11-28 11:48:05
 * @author acrazing <joking.young@gmail.com>
 */

import { fork, forkable } from './immutable_utils';

@forkable
export class AmosList<T> {
  private data: T[];

  get size() {
    return this.data.length;
  }

  constructor(initialList?: T[]) {
    this.data = initialList || [];
  }

  concat(...items: Array<readonly T[]>) {
    this.data = this.data.concat(...items);
    return fork(this);
  }

  every(predicate: (value: T, index: number, array: T[]) => unknown): boolean {
    return this.data.every(predicate);
  }

  fill(value: T, start?: number, end?: number): this {
    this.data.fill(value, start, end);
    return fork(this);
  }

  filter(predicate: (value: T, index: number, array: T[]) => boolean): this {
    this.data = this.data.filter(predicate);
    return fork(this);
  }

  find<S extends T>(
    predicate: (this: void, value: T, index: number, obj: T[]) => value is S,
  ): S | undefined;
  find(predicate: (value: T, index: number, obj: T[]) => unknown): T | undefined;
  find(predicate: (value: T, index: number, obj: T[]) => unknown): any {
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
    this.data = this.data.map(callbackFn);
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

  slice(start?: number, end?: number): this {
    this.data = this.data.slice(start, end);
    return fork(this);
  }

  some(predicate: (value: T, index: number, array: T[]) => boolean): boolean {
    return this.data.some(predicate);
  }

  sort(compareFn?: (a: T, b: T) => number): this {
    this.data.sort(compareFn);
    return fork(this);
  }

  splice(start: number, deleteCount?: number): this;
  splice(start: number, deleteCount: number, ...items: T[]): this;
  splice(start: number, deleteCount?: number, ...items: T[]): this {
    this.data.splice(start, deleteCount!, ...items);
    return fork(this);
  }

  unshift(...items: T[]): this {
    this.data.unshift(...items);
    return fork(this);
  }
}
