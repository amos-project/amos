/*
 * @since 2021-08-08 12:26:44
 * @author junbao <junbao@mymoement.com>
 */

import { threw } from './misc';
import { StorageMap } from './storage';
import { IDOf, PartialRecord, ToString } from './types';

interface LRUNode<K, T> {
  key: IDOf<K>;
  value: T;
  left: this | undefined;
  right: this | undefined;
}

export class LRUMap<T, K = string> implements StorageMap<IDOf<K>, T> {
  private _size: number;
  private head: LRUNode<K, T> | undefined;
  private tail: LRUNode<K, T> | undefined;
  private data: PartialRecord<IDOf<K>, LRUNode<K, T>>;

  constructor(readonly maxSize: number) {
    this.head = void 0;
    this.tail = void 0;
    this._size = 0;
    this.data = {};
  }

  size(): number {
    return this._size;
  }

  keys(): ToString<IDOf<K>>[] {
    return Object.keys(this.data) as ToString<IDOf<K>>[];
  }

  hasItem(key: IDOf<K>): boolean {
    return this.data.hasOwnProperty(key);
  }

  getItem(key: IDOf<K>): T | undefined {
    if (!this.hasItem(key)) {
      return void 0;
    }
    const node = this.data[key]!;
    this.setItem(node.key, node.value);
    return node.value;
  }

  setItem(key: IDOf<K>, value: T): this {
    const node: LRUNode<K, T> = this.data[key] || {
      key: key,
      value,
      left: void 0,
      right: void 0,
    };
    if (node === this.head) {
      // is head
      return this;
    }
    if (node.left) {
      // is not head
      node.left.right = node.right;
    }
    if (node.right) {
      // is not tail
      node.right.left = node.left;
    }
    if (this.head) {
      // has head
      this.head.left = node;
    }
    node.right = this.head;
    this.head = node;
    node.left = void 0;
    if (!this.tail) {
      // does not have tail
      this.tail = node;
    }
    if (!this.hasItem(key)) {
      this.data[key] = node;
      this._size += 1;
      this.mayDrop();
    }
    return this;
  }

  mergeItem(key: IDOf<K>, value: Partial<T>): this {
    threw(!this.hasItem(key), `cannot merge non-existent key: ${key}`);
    Object.assign(this.getItem(key), value);
    return this;
  }

  removeItem(key: IDOf<K>): this {
    throw new Error('Method not implemented.');
  }

  clear(): this {
    this._size = 0;
    this.data = {};
    this.head = void 0;
    this.tail = void 0;
    return this;
  }

  private mayDrop() {
    if (this._size > this.maxSize * 2) {
      this.drop(this._size - this.maxSize);
    }
  }

  private drop(size: number) {
    let node = this.tail!;
    for (let i = 0; i < size; i++) {
      node = node!.left!;
    }
    node.right!.left = void 0;
    node.right = void 0;
    this.tail = node;
    this._size = this._size - size;
  }
}
