/*
 * @since 2020-11-03 13:42:04
 * @author acrazing <joking.young@gmail.com>
 */

import { Dispatch, Store, threw } from 'amos';
import React, { createContext, ReactNode, useContext } from 'react';

export const __Context = createContext<Store | null>(null);

export interface ProviderProps {
  store: Store;
  children: ReactNode;
}

export const Provider = ({ store, children }: ProviderProps) => {
  threw(!store, 'store is required for <Provider />.');
  return <__Context.Provider value={store}>{children}</__Context.Provider>;
};

export const Consumer = __Context.Consumer;

export function useStore(): Store {
  const state = useContext(__Context);
  threw(!state, 'It seems you are using hooks without <Provider />.');
  return state!;
}

export function useDispatch(): Dispatch {
  return useStore().dispatch;
}
