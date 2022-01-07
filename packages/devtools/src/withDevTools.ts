/*
 * @since 2020-11-15 23:17:01
 * @author acrazing <joking.young@gmail.com>
 */

import { Box, Dispatchable, identity, Selectable, StoreEnhancer } from 'amos-core';
import { isArray } from 'amos-utils';

export const enum DispatchKind {
  Preload = 'P',
  Action = 'A',
  Mutation = 'M',
  Signal = 'S',
}

export interface DevToolsOptions {
  /**
   * The name of the store, default is the title of the page
   */
  name?: string;
  /**
   * Force disable devtools even if using {@see forceWithDevTools}
   */
  disable?: boolean;
}

/**
 * Enable devtools when `process.env.NODE_ENV` is `development`
 * @param options
 */
export function withDevTools(options?: DevToolsOptions): StoreEnhancer {
  if (typeof process === 'object' && process.env.NODE_ENV === 'development') {
    return forceWithDevTools(options);
  }
  return (s) => s;
}

declare const __REDUX_DEVTOOLS_EXTENSION__:
  | undefined
  | {
      connect(options?: { name?: string }): {
        init(state: any): void;
        send(action: string | { type: string; [P: string]: any }, state: any): void;
        error(message: string): void;
      };
    };

/**
 * Force enable devtools regardless of `process.env.NODE_ENV`, but you can control it by
 * `options.disable`.
 *
 * @param options
 */
export function forceWithDevTools(options?: DevToolsOptions): StoreEnhancer {
  if (options?.disable || typeof __REDUX_DEVTOOLS_EXTENSION__ === 'undefined') {
    return identity;
  }
  return (StoreClass) => {
    const dev = __REDUX_DEVTOOLS_EXTENSION__.connect(options);
    return class extends StoreClass {
      init() {
        super.init();
        dev.init(this.snapshot());
      }

      protected _select(selectable: Selectable): any {
        if (selectable instanceof Box && !this.snapshot().hasOwnProperty(selectable.key)) {
          const result = super._select(selectable);
          dev.send(`${DispatchKind.Preload}:${selectable.key}`, this.snapshot());
          return result;
        } else {
          return super._select(selectable);
        }
      }

      protected _dispatch(tasks: Dispatchable | readonly Dispatchable[]): any[] {
        const result = super._dispatch(tasks);
        if (!isArray(tasks)) {
          if ('$object' in tasks) {
            switch (tasks.$object) {
              case 'MUTATION':
                dev.send(
                  {
                    type: `${DispatchKind.Mutation}:${tasks.factory.box.key}/${
                      tasks.factory.type || 'anonymous'
                    }`,
                    action: result,
                    args: tasks.args,
                  },
                  this.snapshot(),
                );
                break;
              case 'SIGNAL':
                dev.send(
                  {
                    type: `${DispatchKind.Signal}:${tasks.type}`,
                    data: tasks.data,
                  },
                  this.snapshot(),
                );
                break;
              case 'ACTION':
                dev.send(
                  {
                    type: `${DispatchKind.Action}:${tasks.factory.type || 'anonymous'}`,
                    args: tasks.args,
                  },
                  this.snapshot(),
                );
                break;
            }
          }
        }
        return result;
      }
    };
  };
}
