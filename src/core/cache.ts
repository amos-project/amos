/*
 * @since 2020-12-05 22:58:04
 * @author acrazing <joking.young@gmail.com>
 */

import { Box } from './box';
import { SelectorFactory } from './selector';
import { Select, Selectable, Snapshot } from './store';
import { arrayEqual } from './utils';

export interface TreeNode {
  args: unknown[] | undefined;
  snapshot: Snapshot;
  value: unknown;
  refCount: number;
  children: Map<unknown, TreeNode>;
  parent: TreeNode | undefined;
}

function createNode(parent: undefined | TreeNode): TreeNode {
  return {
    args: void 0,
    snapshot: {},
    value: void 0,
    refCount: 0,
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
  private readonly latest = new Map<SelectorFactory, TreeNode>();
  private snapshot: Snapshot | undefined;

  clear() {
    this.latest.clear();
    this.tree.clear();
    this.snapshot = void 0;
  }

  get(
    selectable: Selectable | null,
    discard: Selectable | undefined | null,
    select: Select,
    state: Snapshot,
  ): unknown {
    const discarded = shouldDelete(selectable, discard);
    if (discarded) {
      this.drop(discarded[0], discarded[1]);
    }
    if (!selectable) {
      return;
    }
    if (!('object' in selectable)) {
      if (selectable instanceof Box) {
        if (this.snapshot) {
          this.snapshot[selectable.key] = state[selectable.key];
        }
        return state[selectable.key];
      } else {
        return selectable(select);
      }
    }
    const args = selectable.object === 'selector' ? selectable.args : [];
    const factory = selectable.object === 'selector' ? selectable.factory : selectable;
    if (factory.cache === false || this.snapshot) {
      // we cache shallow only currently for simplify the select fn
      return factory.calc(select, ...args);
    }
    const node = this.ensure(args, factory);
    if (node.args) {
      let isDirty = false;
      for (const k in node.snapshot) {
        if (node.snapshot.hasOwnProperty(k)) {
          isDirty = node.snapshot[k] !== state[k];
          if (isDirty) {
            break;
          }
        }
      }
      if (!isDirty) {
        return node.value;
      }
    }
    try {
      this.snapshot = {};
      node.value = factory.calc(select, ...args);
      node.args = args;
      node.snapshot = this.snapshot;
      this.snapshot = void 0;
      this.latest.set(factory, node);
      return node.value;
    } finally {
      this.snapshot = void 0;
    }
  }

  /**
   * decrease ref count, if it is free, will be dropped
   * @param args
   * @param factory
   * @private
   */
  private drop(args: unknown[], factory: SelectorFactory) {
    let node = this.tree.get(factory);
    for (let i = 0; i < args.length && node; i++) {
      node = node.children.get(args[i]);
    }
    if (!node) {
      return;
    }
    if (--node.refCount === 0 && node.children.size === 0 && this.latest.get(factory) !== node) {
      if (node.parent) {
        node.parent.children.delete(args[args.length - 1]);
      } else {
        this.tree.delete(factory);
      }
    }
  }

  private ensure(args: unknown[], factory: SelectorFactory) {
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
