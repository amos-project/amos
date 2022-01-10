/*
 * @since 2020-11-03 13:31:31
 * @author acrazing <joking.young@gmail.com>
 */

import { isJSONSerializable, LRUMap, OMap, OSet, Subscribe, Unsubscribe } from 'amos-utils';
import { isArray, threw, toString } from '../../utils/src/misc';
import { Box } from './box';
import { SelectorFactory } from './selector';
import { Dispatch, Dispatchable, Select, Selectable, Snapshot } from './types';

export interface StoreOptions {
  cacheSize?: number;
}

export interface SelectorCache<A extends any[] = any, R = any> {
  factory: SelectorFactory<A, R>;
  args: A;
  value: R;
  boxes: Snapshot;
  selectors: Snapshot;
}

const VALUE_PLACEHOLDER = { '@AMOS_VALUE_PLACEHOLDER@': true };

export class Store {
  static DEFAULT_CACHE_SIZE = 1024;
  protected preloadedState: Snapshot;
  protected options: StoreOptions;
  protected listeners: Subscribe[];
  protected dispatching: Dispatchable | readonly Dispatchable[] | undefined;
  protected state: Snapshot;
  protected boxes: OMap<Box>;
  protected cache: LRUMap<SelectorCache>;
  protected selectorStack: SelectorCache[];

  constructor(preloadedState: Snapshot = {}, options: StoreOptions = {}) {
    this.preloadedState = preloadedState;
    this.options = options;
    this.state = {};
    this.boxes = new OMap<Box>();
    this.listeners = [];
    this.dispatching = void 0;
    this.cache = new LRUMap<SelectorCache>(options.cacheSize ?? Store.DEFAULT_CACHE_SIZE);
    this.selectorStack = [];
  }

  /**
   * executed after construct, used for enhancers.
   */
  init(): this {
    return this;
  }

  /**
   * Take the snapshot of the state.
   *
   * Please note it is mutable.
   */
  snapshot(): Snapshot {
    return this.state;
  }

  /**
   * Subscribe the mutations.
   *
   * The handler will be notified when `store.dispatch` is called with state mutation.
   *
   * @param handler
   */
  subscribe(handler: Subscribe): Unsubscribe {
    this.listeners.push(handler);
    return () => {
      const index = this.listeners.indexOf(handler);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Expose {@see _dispatch} publicly as a property for callbacks.
   *
   * @param tasks
   */
  readonly dispatch: Dispatch = (tasks: any) => this._dispatch(tasks);

  /**
   * expose {@see _select} publicly and callbacks.
   *
   * @param selectable
   */
  select: Select = (selectable: Selectable) => this._select(selectable);

  /**
   * Reset internal state, used for HMR.
   *
   * The works includes:
   *
   * 1. Remove registered boxes
   * 2. Clean up selector caches
   * 3. Serialize and clean up state (works only if set serializeState).
   *
   * @param serializeState - if true, will serialize state and reload it with new boxes, you
   *                         should set is only if your box's state shape (include prototype)
   *                         is changed.
   */
  resetInternalState(serializeState: boolean) {
    if (process.env.NODE_ENV === 'development') {
      threw(
        !!this.dispatching || !!this.selectorStack.length,
        'You cannot call resetInternalState in an action or selector.',
      );
    }
    if (serializeState) {
      this.preloadedState = Object.assign(
        this.preloadedState || {},
        JSON.parse(JSON.stringify(this.state)),
      );
      this.state = {};
    }
    this.boxes.clear();
    this.notify();
  }

  /**
   * Initialize a box, register it and preload its preloaded state.
   *
   * @param box
   * @protected
   */
  protected ensureBox(box: Box) {
    if (!this.boxes.hasOwnProperty(box.key)) {
      this.boxes.setItem(box.key, box);
    }
    if (this.state.hasOwnProperty(box.key)) {
      return this.state[box.key];
    }
    let boxState = box.initialState;
    if (this.preloadedState.hasOwnProperty(box.key)) {
      boxState = isJSONSerializable(box.initialState)
        ? box.initialState.fromJSON(this.preloadedState[box.key])
        : this.preloadedState[box.key];
    }
    this.state[box.key] = boxState;
    return boxState;
  }

  /**
   * Reset a box's state, notify the subscribers to re-initialize it.
   *
   * @param key
   * @protected
   */
  protected resetBox(key: string) {
    if (!this.boxes.hasOwnProperty(key)) {
      return;
    }
    delete this.state[key];
    this.ensureBox(this.boxes.takeItem(key));
    this.notify();
  }

  /**
   * Execute a single dispatchable object.
   *
   * @param dispatchable
   * @protected
   */
  protected _exec(dispatchable: Dispatchable) {
    switch (dispatchable.$amos) {
      case 'ACTION':
        // TODO: consider wrap dispatch with some context information
        //  to track the dispatch stack.
        return dispatchable.factory.actor(this.dispatch, this.select, ...dispatchable.args);
      case 'MUTATION':
        this.ensureBox(dispatchable.box);
        const key = dispatchable.box.key;
        const nextState = dispatchable.mutator(this.state[key], ...dispatchable.args);
        if (nextState !== this.state[key]) {
          this.state[key] = nextState;
        }
        return nextState;
      case 'SIGNAL':
        for (const key in this.boxes) {
          if (!this.boxes.hasOwnProperty(key)) {
            continue;
          }
          const box = this.boxes.takeItem(key);
          const fn = box.signals[dispatchable.type];
          if (!fn) {
            continue;
          }
          const nextState = fn(this.state[key], dispatchable.data);
          if (nextState !== this.state[key]) {
            this.state[key] = nextState;
          }
        }
        return dispatchable.data;
      default:
        threw(true, `Dispatch an object: ${dispatchable['$object'] || toString(dispatchable)}.`);
    }
  }

  /**
   * expose {@see _exec} to callbacks.
   *
   * @param dispatchable
   */
  protected exec = (dispatchable: Dispatchable) => this._exec(dispatchable);

  /**
   * Dispatch a dispatchable object or an array.
   *
   * If it is a transaction entry, notify the subscribers.
   *
   * @param tasks
   * @protected
   */
  protected _dispatch(tasks: Dispatchable | readonly Dispatchable[]) {
    const isRoot = !this.dispatching;
    if (isRoot) {
      this.dispatching = tasks;
    }
    try {
      if (isArray(tasks)) {
        return tasks.map(this.exec);
      } else {
        return this.exec(tasks);
      }
    } finally {
      if (isRoot) {
        this.dispatching = void 0;
        this.notify();
      }
    }
  }

  /**
   * Notify the subscribers.
   *
   * @protected
   */
  protected notify() {
    this.listeners.forEach((fn) => fn());
  }

  /**
   * Select a selectable, and cache its result.
   *
   * A selectable could be:
   *
   * 1. a pure function, it will not be cached
   * 2. a selector instance
   * 3. a selector factory, it will not receive any args
   *
   * @param selectable
   * @protected
   */
  protected _select(selectable: Selectable) {
    // select function
    if (typeof selectable === 'function' && !('$amos' in selectable)) {
      return selectable(this.select);
    }

    const parent = this.selectorStack[this.selectorStack.length - 1];

    // select box
    if (selectable instanceof Box) {
      const boxState = this.ensureBox(selectable);
      if (parent) {
        parent.boxes[selectable.key] = boxState;
      }
      return boxState;
    }

    // select selector or selector factory
    const args = selectable.$amos === 'SELECTOR_FACTORY' ? [] : selectable.args;
    const factory = selectable.$amos === 'SELECTOR_FACTORY' ? selectable : selectable.factory;
    const key = factory.cacheKey?.(...args);
    if (!key && key !== '') {
      return factory.compute(this.select, ...args);
    }
    try {
      const id = `${factory.type}.${factory.id}.${key}`;
      let node = this.selectorCaches.get(id);
      if (!node) {
        node = {
          id: id,
          factory: factory,
          args: args,
          owners: new OSet(),
          usedBoxes: new OSet(),
          usedSelectors: new OSet(),
          value: VALUE_PLACEHOLDER,
        };
      }
      this.selectorStack.push(node);
      if (parent) {
        node.owners.add(parent.id);
        parent.usedSelectors.add(id);
      }
      if (node.value === VALUE_PLACEHOLDER) {
        node.value = factory.compute(this.select, ...args);
      }
      return node.value;
    } finally {
      this.selectorStack.pop();
    }
  }
}
