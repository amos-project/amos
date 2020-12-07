/*
 * @since 2020-11-03 13:22:41
 * @author acrazing <joking.young@gmail.com>
 */

export { FunctionAction, Action, ActionFactory, action } from './core/action';
export { Mutation, Box } from './core/box';
export { FunctionSelector, Selector, SelectorFactory, selector } from './core/selector';
export { Signal, SignalFactory, signal } from './core/signal';
export {
  Snapshot,
  Dispatchable,
  AmosDispatch,
  Dispatch,
  Selectable,
  Select,
  Store,
  StoreEnhancer,
  createStore,
} from './core/store';
export { JSONState, JSONSerializable, isJSONSerializable, fromJSON } from './core/types';
export {
  identity,
  shallowEqual,
  hoistMethod,
  AmosObject,
  isAmosObject,
  arrayEqual,
  clone,
} from './core/utils';

export { ConnectedProps, ConnectedComponent, Connector, connect } from './react/connect';
export { ProviderProps, Provider, ConsumerProps, Consumer } from './react/context';
export { useStore, useDispatch, MapSelector, useSelector } from './react/hooks';

export { DictKey, AmosDict, createDictBox } from './state/AmosDict';
export { AmosList, createListBox } from './state/AmosList';
export { AmosListDict, createListDictBox } from './state/AmosListDict';
export { AmosRecordDict, createRecordDictBox } from './state/AmosRecordDict';
export { createBoxFactory } from './state/createBoxFactory';
export { forkable, fork } from './state/utils';

export const VERSION: string = '__VERSION__';
