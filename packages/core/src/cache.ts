/*
 * @since 2020-12-05 22:58:04
 * @author acrazing <joking.young@gmail.com>
 */

import { Box } from './box';
import { Selector, SelectorFactory } from './selector';
import { Select, Selectable, Snapshot } from './store';
import { arrayEqual, isKcatsObject } from './utils';

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
  if (!discard) {
    return false;
  }
  let discardArgs: unknown[];
  let discardFactory: SelectorFactory;
  if (isKcatsObject<Selector>('selector', discard)) {
    discardArgs = discard.args;
    discardFactory = discard.factory;
  } else if (isKcatsObject<SelectorFactory>('selector_factory', discard)) {
    discardArgs = [];
    discardFactory = discard;
  } else {
    return false;
  }
  if (discardFactory.cache === false) {
    return false;
  }
  if (!input) {
    return [discardArgs, discardFactory];
  }
  let inputArgs: unknown[];
  let inputFactory: SelectorFactory;
  if (isKcatsObject<Selector>('selector', input)) {
    inputArgs = input.args;
    inputFactory = input.factory;
  } else if (isKcatsObject<SelectorFactory>('selector_factory', input)) {
    inputArgs = [];
    inputFactory = input;
  } else {
    return [discardArgs, discardFactory];
  }
  return inputFactory === discardFactory && arrayEqual(inputArgs, discardArgs)
    ? false
    : [discardArgs, discardFactory];
}

/** @internal */
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
    if (selectable instanceof Box) {
      if (this.snapshot) {
        this.snapshot[selectable.key] = state[selectable.key];
      }
      return state[selectable.key];
    }
    let args: unknown[];
    let factory: SelectorFactory;
    if (isKcatsObject<Selector>('selector', selectable)) {
      args = selectable.args;
      factory = selectable.factory;
    } else if (isKcatsObject<SelectorFactory>('selector_factory', selectable)) {
      args = [];
      factory = selectable;
    } else {
      return selectable(select);
    }
    if (factory.cache === false || this.snapshot) {
      // we do not process selector deps tree, it complicates the cache system
      return factory.calc(select, ...args);
    }
    const node = this.ensure(args, factory);
    if (node.args) {
      let isDirty = false;
      for (const k in node.snapshot) {
        if (node.snapshot.hasOwnProperty(k)) {
          if (node.snapshot[k] !== state[k]) {
            isDirty = true;
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
