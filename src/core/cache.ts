/*
 * @since 2020-11-28 15:00:12
 * @author acrazing <joking.young@gmail.com>
 *
 * cache strategy:
 *
 * pure function will not cache
 */

import { SelectorFactory } from './selector';
import { Snapshot } from './store';

export interface TreeNode {
  args: unknown[] | undefined;
  deps: unknown[] | Snapshot | undefined;
  value: unknown | undefined;
  readonly used: Set<TreeNode>;
  readonly usedBy: Set<TreeNode>;
  readonly children: Map<unknown, TreeNode>;
  readonly parent: TreeNode | undefined;
}

export class Cache {
  private readonly tree: Map<SelectorFactory, TreeNode>;
  private readonly latest: Map<SelectorFactory, TreeNode>;

  constructor() {
    this.tree = new Map();
    this.latest = new Map();
  }

  get(factory: SelectorFactory, args: unknown[]) {
    let node = this.tree.get(factory);
    for (let i = 0; i < args.length && node; i++) {
      node = node.children.get(args[i]);
    }
    return node;
  }
}
