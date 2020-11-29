/*
 * @since 2020-11-03 13:22:41
 * @author acrazing <joking.young@gmail.com>
 */

export { JSONState, Mutation, Box } from './core/box';
export { Action, ActionFactory, action } from './core/action';
export { Signal, SignalFactory, signal } from './core/signal';
export { Selector, SelectorFactory, selector } from './core/selector';
export {
  Dispatchable,
  AmosDispatch,
  Dispatch,
  Selectable,
  Select,
  Snapshot,
  StoreEnhancer,
  Store,
  createStore,
} from './core/store';
export { ProviderProps, Provider, ConsumerProps, Consumer } from './react/context';
export { useStore, useDispatch, MapSelector, useSelector } from './react/hooks';
export { identity, shallowEqual, isAmosObject, hoistMethod, arrayEqual } from './core/utils';

export const VERSION: string = '__VERSION__';
