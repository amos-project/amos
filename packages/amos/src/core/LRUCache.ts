/*
 * @since 2021-08-08 12:26:44
 * @author junbao <junbao@mymoement.com>
 */

import { Cache } from './types';

interface LRUNode<T> {
  id: string;
  value: T;
  left: this | undefined;
  right: this | undefined;
}

export class LRUCache<T> implements Cache<T> {
  private head: LRUNode<T> | undefined;
  private tail: LRUNode<T> | undefined;
  private map: Record<string, LRUNode<T>>;
  size: number;

  constructor(readonly maxSize: number) {
    this.head = void 0;
    this.tail = void 0;
    this.size = 0;
    this.map = {};
  }

  delete(id: string): void {
    throw new Error('Method not implemented.');
  }

  get(id: string): T | undefined {
    if (!this.map.hasOwnProperty(id)) {
      return void 0;
    }
    const node = this.map[id];
    this.set(node.id, node.value);
    return node.value;
  }

  set(id: string, value: T) {
    const node: LRUNode<T> = this.map[id] || {
      id,
      value,
      left: void 0,
      right: void 0,
    };
    if (node === this.head) {
      // is head
      return;
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
    if (!this.map.hasOwnProperty(node.id)) {
      this.map[id] = node;
      this.size += 1;
      this.mayDrop();
    }
  }

  private mayDrop() {
    if (this.size > this.maxSize * 2) {
      this.drop(this.size - this.maxSize);
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
    this.size = this.size - size;
  }
}
