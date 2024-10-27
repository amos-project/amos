/*
 * @since 2020-11-15 23:17:01
 * @author acrazing <joking.young@gmail.com>
 */

import { $amos, __DEV__, append, isAmosObject, override } from 'amos-utils';
import { Action, Box, Mutation, Signal, StoreEnhancer } from '../index';

export interface DevAction {
  type: string;
  args: any[];
  root: DevAction | undefined;
}

export interface ReduxDevtoolsExtension {
  connect(options?: { name?: string }): {
    init(state: any): void;
    send(action: DevAction, state: any): void;
  };
}

export interface DevtoolsOptions {
  /**
   * If set, will ignore NODE_ENV, else will auto enable/disable by check
   * if NODE_ENV === 'development' or not
   */
  enable?: boolean;
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
    const finalOptions: DevtoolsOptions =
      options.devtools === void 0
        ? {}
        : typeof options.devtools === 'boolean'
          ? {
              enable: options.devtools,
            }
          : options.devtools;
    const enable = finalOptions.enable ?? __DEV__;
    const extension =
      finalOptions.extension ??
      (typeof __REDUX_DEVTOOLS_EXTENSION__ === 'undefined' ? void 0 : __REDUX_DEVTOOLS_EXTENSION__);

    if (!extension || !enable) {
      return store;
    }

    const dev = extension.connect({ name: options.name });
    let root: DevAction | undefined;
    override(store, 'select', (select) => {
      return (s: any): any => {
        const isPreload = isAmosObject<Box>(s, 'box') && !store.state.hasOwnProperty(s.key);
        const result = select(s);
        if (isPreload) {
          dev.send(
            {
              type: `P:${s.key}`,
              args: [result],
              root: root,
            },
            { ...store.snapshot() },
          );
        }
        return result;
      };
    });
    override(store, 'dispatch', (dispatch) => {
      return (task: any): any => {
        if (
          !isAmosObject<Mutation>(task, 'mutation') &&
          !isAmosObject<Action>(task, 'action') &&
          !isAmosObject<Signal>(task, 'signal')
        ) {
          return dispatch(task);
        }
        const action: DevAction = {
          type: `${task[$amos].charAt(0).toUpperCase()}:${task.type}`,
          args: task.args,
          root: root,
        };
        root ??= action;
        try {
          const result = dispatch(task);
          // we should not be aware the return type is promise or not.
          // we have no dispatch tree at this moment.
          dev.send(action, { ...store.snapshot() });
          return result;
        } finally {
          if (root === action) {
            root = void 0;
          }
        }
      };
    });
    append(store, 'init', () => dev.init({ ...store.snapshot() }));
    return store;
  };
}
