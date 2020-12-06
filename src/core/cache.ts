/*
 * @since 2020-12-05 22:58:04
 * @author acrazing <joking.young@gmail.com>
 *
 * Cache tree:
 *
 * specification: <ID>(B), <ID>(S,S|D)
 *
 * A(S,S) -> B(S,S) -> C(S,S) -> D(B)
 *
 */

import { Box } from './box';
import { SelectorFactory } from './selector';
import { Select, Selectable, Snapshot } from './store';
import { arrayEqual } from './utils';

export interface TreeNode {
  args: unknown[] | undefined;
  snapshot: Snapshot;
  lastSnapshot: Snapshot;
  value: unknown;
  refCount: number;
  deps: Set<TreeNode>;
  lastDeps: Set<TreeNode>;
  children: Map<unknown, TreeNode>;
  parent: TreeNode | undefined;
}

function createNode(parent: undefined | TreeNode): TreeNode {
  return {
    args: void 0,
    snapshot: {},
    lastSnapshot: {},
    value: void 0,
    refCount: 0,
    deps: new Set<TreeNode>(),
    lastDeps: new Set<TreeNode>(),
    children: new Map<unknown, TreeNode>(),
    parent: parent,
  };
}

function shouldDelete(
  input: Selectable | null,
  discard: Selectable | undefined | null,
): [unknown[], SelectorFactory] | false {
  if (!discard || !('object' in discard)) {
    return false;
  }
  const discardArgs = discard.object === 'selector' ? discard.args : [];
  const discardFactory = discard.object === 'selector' ? discard.factory : discard;
  if (discardFactory.cache === false) {
    return false;
  }
  if (!input || !('object' in input)) {
    return [discardArgs, discardFactory];
  }
  const inputArgs = input.object === 'selector' ? input.args : [];
  const inputFactory = input.object === 'selector' ? input.factory : input;
  return inputFactory === discardFactory && arrayEqual(inputArgs, discardArgs)
    ? false
    : [discardArgs, discardFactory];
}

export class Cache {
  private readonly tree = new Map<SelectorFactory, TreeNode>();
  private readonly latest = new Set<TreeNode>();
  private readonly stack = Array<TreeNode>(8);
  private stackSize = 0;

  private current() {
    return this.stack[this.stackSize - 1];
  }

  private push(node: TreeNode) {
    this.stack[this.stackSize++] = node;
  }

  private pop() {
    this.stack[--this.stackSize] = void 0 as any;
  }

  get(
    selectable: Selectable | null,
    discard: Selectable | undefined | null,
    select: Select,
    state: Snapshot,
  ) {
    const discarded = shouldDelete(selectable, discard);
    if (discarded) {
      this.decrRef(discarded[0], discarded[1]);
    }
    if (!selectable) {
      return;
    } else if (!('object' in selectable)) {
      if (selectable instanceof Box) {
        this.current().snapshot[selectable.key] = state[selectable.key];
        return state[selectable.key];
      } else {
        return selectable(select);
      }
    }
    const args = selectable.object === 'selector' ? selectable.args : [];
    const factory = selectable.object === 'selector' ? selectable.factory : selectable;
    const node = this.ensure(args, factory);
  }

  /**
   * decrease ref count, if it is free, will be dropped
   * @param args
   * @param factory
   * @private
   */
  private decrRef(args: unknown[], factory: SelectorFactory) {
    let node = this.tree.get(factory);
    for (let i = 0; i < args.length && node; i++) {
      node = node.children.get(args[i]);
    }
    if (!node || node.refCount === 0) {
      // does not exist or free already(shallow node or latest), do nothing
      return;
    }
    if (--node.refCount === 0 && node.children.size === 0 && !this.latest.has(node)) {
      if (node.parent) {
        node.parent.children.delete(args[args.length - 1]);
      } else {
        this.tree.delete(factory);
      }
    }
  }

  ensure(args: unknown[], factory: SelectorFactory) {
    let node = this.tree.get(factory);
    if (!node) {
      node = createNode(void 0);
      this.tree.set(factory, node);
    }
    for (let i = 0; i < args.length; i++) {
      if (!node.children.has(args[i])) {
        node.children.set(args[i], createNode(node));
      }
      node = node.children.get(args[i])!;
    }
    return node;
  }
}
