/*
 * @since 2020-11-04 12:38:33
 * @author acrazing <joking.young@gmail.com>
 */

import { Dispatch, Select } from '@kcats/core';
import React, {
  ComponentProps,
  ComponentType,
  ElementRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import { Consumer } from './context';

export interface ConnectedProps {
  dispatch: Dispatch;
}

export type ConnectedComponent<
  TOwnedProps,
  TMappedProps,
  C extends ComponentType<any>
> = ForwardRefExoticComponent<
  PropsWithoutRef<
    Omit<ComponentProps<C>, keyof TMappedProps | keyof ConnectedProps> & TOwnedProps
  > &
    RefAttributes<ElementRef<C>>
> & {
  WrappedComponent: C;
};

export type Connector<TOwnedProps extends object = {}, TMappedProps extends object = {}> = <
  C extends ComponentType<Partial<ConnectedProps> & TMappedProps & ComponentProps<C>>
>(
  Component: C,
) => ConnectedComponent<TOwnedProps, TMappedProps, C>;

const emptyMapper = () => ({});

export function connect<TMappedProps extends object = {}, TOwnedProps extends object = {}>(
  mapper: (select: Select, ownedProps: TOwnedProps) => TMappedProps = emptyMapper as any,
): Connector<TOwnedProps, TMappedProps> {
  return function connector(Component: any) {
    const ConnectedComponent = forwardRef<any, any>((props, ref) => {
      // TODO listen updates
      return (
        <Consumer>
          {(store) => (
            <Component {...mapper(store.select, props)} {...props} ref={ref}>
              {props.children}
            </Component>
          )}
        </Consumer>
      );
    }) as ConnectedComponent<any, any, any>;
    ConnectedComponent.WrappedComponent = Component;
    return ConnectedComponent;
  } as any;
}
