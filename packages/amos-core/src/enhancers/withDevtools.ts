/*
 * @since 2020-11-15 23:17:01
 * @author acrazing <joking.young@gmail.com>
 */

import { $amos, isAmosObject, override } from 'amos-utils';
import { Action, Box, Mutation, Signal, StoreEnhancer } from '../index';

export interface ReduxDevtoolsExtension {
  connect(options?: { name?: string }): {
    init(state: any): void;
    send(action: string | { type: string; [P: string]: any }, state: any): void;
    error(message: string): void;
  };
}

export interface DevtoolsOptions {
  /**
   * Force enable devtools, ignore env.
   */
  force?: boolean;
  /**
   * Custom extension connector
   */
  extension?: ReduxDevtoolsExtension;
}

declare const __REDUX_DEVTOOLS_EXTENSION__: undefined | ReduxDevtoolsExtension;

export function withDevtools(): StoreEnhancer {
  return (next) => (options) => {
    const store = next(options);
    if (options.devtools === false) {
      return store;
    }
    const extension =
      options.devtools?.extension ||
      (typeof __REDUX_DEVTOOLS_EXTENSION__ === 'undefined' ? void 0 : __REDUX_DEVTOOLS_EXTENSION__);

    if (!extension) {
      return store;
    }

    if (
      !options.devtools?.force &&
      typeof process === 'object' &&
      process.env.NODE_ENV !== 'development'
    ) {
      return store;
    }

    const dev = extension.connect({ name: options.name });
    override(store, 'select', (select) => {
      return (s: any): any => {
        const isPreload = isAmosObject<Box>(s, 'box') && !store.state.hasOwnProperty(s.key);
        const result = select(s);
        if (isPreload) {
          dev.send(
            {
              type: `P:${s.key}`,
              state: result,
            },
            store.state,
          );
        }
        return result;
      };
    });
    override(store, 'dispatch', (dispatch) => {
      return (task: any): any => {
        const result = dispatch(task);
        if (
          isAmosObject<Mutation>(task, 'mutation') ||
          isAmosObject<Action>(task, 'action') ||
          isAmosObject<Signal>(task, 'signal')
        ) {
          dev.send(
            {
              type: `${task[$amos].charAt(0).toUpperCase()}:${task.type}`,
              params: task.args,
            },
            store.state,
          );
        }
        return result;
      };
    });
    dev.init(store.state);
    return store;
  };
}
