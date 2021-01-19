/*
 * @since 2020-11-15 23:17:01
 * @author acrazing <joking.young@gmail.com>
 */

import { Dispatch, Dispatchable, Select, Selectable, Snapshot, StoreEnhancer } from '@kcats/core';

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
      connect(options?: {
        name?: string;
      }): {
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
  if (options?.disable) {
    return (s) => s;
  }
  return (store) => {
    if (typeof __REDUX_DEVTOOLS_EXTENSION__ === 'undefined') {
      return store;
    }
    const dev = __REDUX_DEVTOOLS_EXTENSION__.connect(options);
    dev.init(store.snapshot());
    store.select = ((select: Select) => {
      const newSelect: Select = ((selectable: Selectable, snapshot?: Snapshot) => {
        const result = select(selectable, snapshot);
        if ('key' in selectable && !store.snapshot().hasOwnProperty(selectable.key)) {
          dev.send(`${DispatchKind.Preload}:${selectable.key}`, store.snapshot());
        }
        return result;
      }) as Select;
      return copyProperties(select, newSelect);
    })(store.select);
    store.dispatch = ((dispatch: Dispatch) => {
      const newDispatch: Dispatch = ((task: Dispatchable) => {
        const result = dispatch(task);
        if (!Array.isArray(task)) {
          switch (task.object) {
            case 'mutation':
              dev.send(
                {
                  type: `${DispatchKind.Mutation}:${task.box.key}/${task.type || 'anonymous'}`,
                  action: task.result,
                  args: task.args,
                },
                store.snapshot(),
              );
              break;
            case 'signal':
              dev.send(
                {
                  type: `${DispatchKind.Signal}:${task.type}`,
                  data: task.data,
                },
                store.snapshot(),
              );
              break;
            case 'action':
              dev.send(
                {
                  type: `${DispatchKind.Action}:${task.type || 'anonymous'}`,
                  args: task.args,
                },
                store.snapshot(),
              );
              break;
          }
        }
        return result;
      }) as Dispatch;
      return copyProperties(dispatch, newDispatch);
    })(store.dispatch);
    return store;
  };
}

function copyProperties<T extends object>(src: T, dst: Partial<T>) {
  const copy = (name: PropertyKey) => {
    if (dst.hasOwnProperty(name)) {
      return;
    }
    Object.defineProperty(dst, name, Object.getOwnPropertyDescriptor(src, name)!);
  };
  Object.getOwnPropertyNames(src).forEach(copy);
  Object.getOwnPropertySymbols?.(src).forEach(copy);
  return dst as T;
}
