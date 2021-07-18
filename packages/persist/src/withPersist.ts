/*
 * @since 2021-07-18 15:12:36
 * @author junbao <junbao@mymoement.com>
 */

import { Box, StoreEnhancer } from 'amos';
import { PersistedState, PersistOptions } from './types';

export function withPersist(options: PersistOptions): StoreEnhancer {
  return (StoreClass) => {
    const { key, engine, excludes, includes } = options;
    return class WithPersistStore extends StoreClass {
      readonly persistOptions = options;
      private isHydrated = false;
      private persistedState: Record<string, PersistedState<any>> = {};

      init() {
        super.init();
        this.subscribe(this.persist);
      }

      async hydrate() {
        try {
          const value = await engine.getItem(key);
          if (!value) {
            return;
          }
          this.persistedState = (await JSON.parse(value)) || {};
          this.expiredBoxes = {};
          for (const key in this.state) {
            if (!this.state.hasOwnProperty(key) || !this.persistedState.hasOwnProperty(key)) {
              continue;
            }
            const box = this.boxes[key];
            if (this.allowBox(box) && this.persistedState[key].v === box.options.persistVersion) {
              this.resetBox(key);
            }
          }
          this.notify();
        } catch {}
        this.isHydrated = true;
      }

      private allowBox(box: Box) {
        return (
          !!box.options.persistVersion &&
          (!includes || includes.some((k) => k === box.key || (k as Box).key === box.key)) &&
          (!excludes || !excludes.some((k) => k === box.key || (k as Box).key === box.key))
        );
      }

      protected ensureBox(box: Box): unknown {
        if (!this.state.hasOwnProperty(box.key) && this.isHydrated) {
          if (this.allowBox(box)) {
            if (
              this.persistedState.hasOwnProperty(box.key) &&
              this.persistedState[box.key].v === box.options.persistVersion
            ) {
              this.preloadedState[box.key] = this.persistedState[box.key].s;
            } else {
              delete this.persistedState[box.key];
            }
          } else {
            delete this.persistedState[box.key];
          }
        }
        return super.ensureBox(box);
      }

      private persist = () => {
        if (!this.isHydrated) {
          return;
        }
      };
    };
  };
}
