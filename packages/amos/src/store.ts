/*
 * @since 2020-11-03 13:31:31
 * @author acrazing <joking.young@gmail.com>
 */

import { Box } from './box';
import { SelectorFactory } from './selector';
import {
  Dispatch,
  Dispatchable,
  Select,
  Selectable,
  Snapshot,
  Subscribe,
  Unsubscribe,
} from './types';
import { CheapMap, CheapSet, isArray, threw, toString, warning } from './utils';

export interface StoreOptions {}

export interface SelectorCache<A extends any[] = any, R = any> {
  id: string;
  factory: SelectorFactory<A, R>;
  args: A;
  owners: CheapSet;
  usedBoxes: CheapSet;
  usedSelectors: CheapSet;
  value: R;
}

const VALUE_PLACEHOLDER = { '@AMOS_VALUE_PLACEHOLDER@': true };

export class Store {
  protected preloadedState: Snapshot;
  protected options: StoreOptions;
  protected listeners: Subscribe[];
  protected dispatching: Dispatchable | readonly Dispatchable[] | undefined;
  protected state: Snapshot;
  protected boxes: CheapMap<Box>;
  protected expiredBoxes: CheapSet;
  protected usedBoxes: CheapMap<CheapSet>;
  protected selectorStack: SelectorCache[];

  /**
   * The caches of selectors, please note it may be dirty.
   * @protected
   */
  protected selectorCaches: CheapMap<SelectorCache>;

  constructor(preloadedState: Snapshot = {}, options: StoreOptions = {}) {
    this.preloadedState = preloadedState;
    this.options = options;
    this.state = {};
    this.boxes = new CheapMap<Box>();
    this.listeners = [];
    this.dispatching = void 0;
    this.selectorStack = [];
    this.expiredBoxes = new CheapSet<string>();
    this.usedBoxes = new CheapMap<CheapSet>();
    this.selectorCaches = new CheapMap<SelectorCache>();
  }

  /**
   * executed after construct, used for enhancers.
   */
  init() {}

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
   * Initialize a box, register it and preload its preloaded state.
   *
   * @param box
   * @protected
   */
  protected ensureBox(box: Box) {
    if (!this.boxes.hasOwnProperty(box.key)) {
      this.boxes.set(box.key, box);
    }
    if (this.state.hasOwnProperty(box.key)) {
      return this.state[box.key];
    }
    let boxState = box.initialState;
    if (this.preloadedState.hasOwnProperty(box.key)) {
      boxState = box.options.preload!(this.preloadedState[box.key], boxState);
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
    this.ensureBox(this.boxes.take(key));
    this.notify();
  }

  /**
   * Execute a single dispatchable object.
   *
   * @param dispatchable
   * @protected
   */
  protected _exec(dispatchable: Dispatchable) {
    switch (dispatchable.$object) {
      case 'ACTION':
        // TODO: consider wrap dispatch with some context information
        //  to track the dispatch stack.
        return dispatchable.factory.actor(this.dispatch, this.select, ...dispatchable.args);
      case 'MUTATION':
        this.ensureBox(dispatchable.factory.box);
        const key = dispatchable.factory.box.key;
        const nextState = dispatchable.factory.mutator(this.state[key], ...dispatchable.args);
        if (nextState !== this.state[key]) {
          this.state[key] = nextState;
          this.expiredBoxes.add(key);
        }
        return nextState;
      case 'SIGNAL':
        for (const key in this.boxes) {
          if (!this.boxes.hasOwnProperty(key)) {
            continue;
          }
          const box = this.boxes.take(key);
          const fn = box.signals[dispatchable.type];
          if (!fn) {
            continue;
          }
          const nextState = fn(this.state[key], dispatchable.data);
          if (nextState !== this.state[key]) {
            this.state[key] = nextState;
            this.expiredBoxes.add(key);
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
    if (process.env.NODE_ENV === 'development') {
      threw(!!this.selectorStack.length, 'You cannot dispatch a dispatchable in selector.');
    }
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
   * Drop the expired selector caches.
   *
   * @protected
   */
  protected dropExpiredCaches() {
    const verified = new CheapSet();
    const drop = (id: string) => {};
    const verify = (id: string): boolean => {
      if (verified.has(id)) {
        // verified selectors, return directly.
        return this.selectorCaches.has(id);
      }
      const cache = this.selectorCaches.get(id);
      if (!cache) {
        // it is dropped already.
        return false;
      }
      if (cache.usedSelectors.every(verify)) {
        // every deps selector is ok, check boxes
        if (cache.usedBoxes.every((key) => !this.expiredBoxes.has(key))) {
          // box is also fine, it is fine
          verified.add(id);
          return true;
        } else {
          verified.add(id);
          if (cache.factory.expire === 'passive') {
            drop(id);
            return false;
          } else {
            try {
              const newValue = cache.factory.compute(this.select, ...cache.args);
              if (cache.factory.equal!(cache.value, newValue)) {
                return true;
              } else {
                drop(id);
                return false;
              }
            } catch (e) {
              warning(true, e?.stack || e + '');
              drop(id);
              return false;
            }
          }
        }
      } else {
        // if deps is expired, it will recompute all its dependents,
        // if expired, it should be dropped and added to verified already.
        return this.selectorCaches.has(id);
      }
    };

    this.expiredBoxes.forEach((key) => {
      const ref = this.usedBoxes.get(key);
      if (!ref) {
        return;
      }
      ref.forEach(verify);
    });
    this.expiredBoxes.clear();
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
   * Expose {@see _dispatch} publicly as a property for callbacks.
   *
   * @param tasks
   */
  readonly dispatch: Dispatch = (tasks: any) => this._dispatch(tasks);

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
    this.dropExpiredCaches();
    // select function
    if (typeof selectable === 'function' && !('$object' in selectable)) {
      return selectable(this.select);
    }

    const parent = this.selectorStack[this.selectorStack.length - 1];

    // select box
    if (selectable instanceof Box) {
      const boxState = this.ensureBox(selectable);
      if (parent) {
        if (!this.usedBoxes.has(selectable.key)) {
          this.usedBoxes.set(selectable.key, new CheapSet([selectable.key]));
        } else {
          this.usedBoxes.take(selectable.key).add(selectable.key);
        }
        parent.usedBoxes.add(selectable.key);
      }
      return boxState;
    }

    // select selector or selector factory
    const args = selectable.$object === 'SELECTOR_FACTORY' ? [] : selectable.args;
    const factory = selectable.$object === 'SELECTOR_FACTORY' ? selectable : selectable.factory;
    try {
      const id = `${factory.type}${factory.id}.${factory.key!(this.select, ...args)}`;
      let node = this.selectorCaches.get(id);
      if (!node) {
        node = {
          id: id,
          factory: factory,
          args: args,
          owners: new CheapSet(),
          usedBoxes: new CheapSet(),
          usedSelectors: new CheapSet(),
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
    this.expiredBoxes.clear();
    this.usedBoxes.clear();
    this.selectorCaches.clear();
    this.notify();
  }
}
