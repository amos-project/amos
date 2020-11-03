/*
 * @since 2020-11-03 13:42:04
 * @author acrazing <joking.young@gmail.com>
 */

import React, {
  ComponentProps,
  ComponentType,
  createContext,
  forwardRef,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Dispatch, Store } from './store';

export interface ContextState {
  store: Store;
}

export const __Context = createContext<ContextState | null>(null);

export interface ProviderProps {
  store: Store;
  children: ReactElement;
}

export function Provider({ store, children }: ProviderProps) {
  const [state, setState] = useState<ContextState>({ store });
  useEffect(() => {
    state.store !== state.store && setState({ store });
  }, [store]);
  return <__Context.Provider value={state}>{children}</__Context.Provider>;
}

export function useStore(): Store {
  const state = useContext(__Context);
  if (!state) {
    throw new Error('[Moedux] you are using hooks without <Provider />.');
  }
  return state.store;
}

export function useDispatch(): Dispatch {
  const store = useStore();
  return store.dispatch;
}

export function connect<TOwnedProps, TMappedProps>(
  mapProps: (store: Store, ownedProps: TOwnedProps) => TMappedProps,
) {
  return function connector<
    TProps extends TOwnedProps & TMappedProps,
    C extends ComponentType<TProps>
  >(Component: C) {
    return forwardRef<React.ElementRef<C>, Omit<ComponentProps<C>, keyof TMappedProps>>(
      (props, ref) => {
        const store = useStore();
        const mappedProps = mapProps(store, (props as unknown) as TOwnedProps);
        return (
          <Component {...mappedProps} {...(props as any)} ref={ref}>
            {props.children}
          </Component>
        );
      },
    );
  };
}
