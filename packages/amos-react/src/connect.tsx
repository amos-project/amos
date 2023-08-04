/*
 * @since 2020-11-04 12:38:33
 * @author acrazing <joking.young@gmail.com>
 */

import React, {
  ComponentProps,
  ComponentType,
  ElementRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useEffect,
  useReducer,
} from 'react';
import { useStore } from './context';
import { Dispatch, Select } from 'amos-core';

export interface ConnectedProps {
  dispatch: Dispatch;
}

export type ConnectedComponent<
  TOwnedProps,
  TMappedProps,
  C extends ComponentType<any>,
> = ForwardRefExoticComponent<
  PropsWithoutRef<
    Omit<ComponentProps<C>, keyof TMappedProps | keyof ConnectedProps> & TOwnedProps
  > &
    RefAttributes<ElementRef<C>>
> & {
  WrappedComponent: C;
};

export type Connector<TOwnedProps extends object = {}, TMappedProps extends object = {}> = <
  C extends ComponentType<Partial<ConnectedProps> & TMappedProps & ComponentProps<C>>,
>(
  Component: C,
) => ConnectedComponent<TOwnedProps, TMappedProps, C>;

const emptyMapper = () => ({});

export function connect<TMappedProps extends object = {}, TOwnedProps extends object = {}>(
  mapProps: (select: Select, ownedProps: TOwnedProps) => TMappedProps = emptyMapper as any,
): Connector<TOwnedProps, TMappedProps> {
  return function connector(Component: any) {
    const ConnectedComponent = forwardRef<any, any>((props, ref) => {
      const [, update] = useReducer((s) => s + 1, 0);
      const store = useStore();
      const mappedProps = mapProps(store.select, props);
      useEffect(() => store.subscribe(update), [store]);
      return <Component {...props} {...mappedProps} dispatch={store.dispatch} ref={ref} />;
    }) as ConnectedComponent<any, any, any>;
    ConnectedComponent.WrappedComponent = Component;
    return ConnectedComponent;
  } as any;
}
