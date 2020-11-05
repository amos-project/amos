/*
 * @since 2020-11-04 12:38:33
 * @author acrazing <joking.young@gmail.com>
 */

import hoistNonReactStatics from 'hoist-non-react-statics';
import React, {
  ComponentProps,
  ComponentType,
  ElementRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import { Box } from './box';
import { Consumer } from './context';
import { Dispatch, Store } from './store';

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
} & hoistNonReactStatics.NonReactStatics<C>;

export type Connector<TOwnedProps = {}, TMappedProps = {}> = <
  C extends ComponentType<Partial<ConnectedProps> & TMappedProps & ComponentProps<C>>
>(
  Component: C,
) => ConnectedComponent<TOwnedProps, TMappedProps, C>;

export function connect(): Connector;
export function connect<TMappedProps, TOwnedProps = {}>(
  mapProps: (store: Store, ownedProps: TOwnedProps) => TMappedProps,
): Connector<TOwnedProps, TMappedProps>;
export function connect<S1, TMappedProps, TOwnedProps = {}>(
  box1: Box<S1>,
  mapProps: (store: Store, state1: S1, ownedProps: TOwnedProps) => TMappedProps,
): Connector<TOwnedProps, TMappedProps>;
export function connect<S1, S2, TMappedProps, TOwnedProps = {}>(
  box1: Box<S1>,
  box2: Box<S2>,
  mapProps: (store: Store, state1: S1, state2: S2, ownedProps: TOwnedProps) => TMappedProps,
): Connector<TOwnedProps, TMappedProps>;
export function connect<S1, S2, S3, TMappedProps, TOwnedProps = {}>(
  box1: Box<S1>,
  box2: Box<S2>,
  box3: Box<S3>,
  mapProps: (
    store: Store,
    state1: S1,
    state2: S2,
    state3: S3,
    ownedProps: TOwnedProps,
  ) => TMappedProps,
): Connector<TOwnedProps, TMappedProps>;
export function connect<S1, S2, S3, S4, TMappedProps, TOwnedProps = {}>(
  box1: Box<S1>,
  box2: Box<S2>,
  box3: Box<S3>,
  box4: Box<S4>,
  mapProps: (
    store: Store,
    state1: S1,
    state2: S2,
    state3: S3,
    state4: S4,
    ownedProps: TOwnedProps,
  ) => TMappedProps,
): Connector<TOwnedProps, TMappedProps>;
export function connect<S1, S2, S3, S4, S5, TMappedProps, TOwnedProps = {}>(
  box1: Box<S1>,
  box2: Box<S2>,
  box3: Box<S3>,
  box4: Box<S4>,
  box5: Box<S5>,
  mapProps: (
    store: Store,
    state1: S1,
    state2: S2,
    state3: S3,
    state4: S4,
    state5: S5,
    ownedProps: TOwnedProps,
  ) => TMappedProps,
): Connector<TOwnedProps, TMappedProps>;
export function connect<S1, S2, S3, S4, S5, S6, TMappedProps, TOwnedProps = {}>(
  box1: Box<S1>,
  box2: Box<S2>,
  box3: Box<S3>,
  box4: Box<S4>,
  box5: Box<S5>,
  box6: Box<S6>,
  mapProps: (
    store: Store,
    state1: S1,
    state2: S2,
    state3: S3,
    state4: S4,
    state5: S5,
    state6: S6,
    ownedProps: TOwnedProps,
  ) => TMappedProps,
): Connector<TOwnedProps, TMappedProps>;
export function connect(...args: any[]) {
  const fnIndex = args.findIndex((p) => typeof p === 'function');
  if (args.length > 0 && fnIndex === -1) {
    throw new Error('[Amos] props mapper is required for inject boxes');
  }
  const fn = fnIndex === -1 ? () => ({}) : args[fnIndex];
  const deps: Box[] = args.slice(0, fnIndex);
  const mapper = (store: Store, ownedProps: any) => {
    const mapped = fn([store].concat(deps.map(store.pick), [ownedProps])) || {};
    Object.assign(mapped, { dispatch: store.dispatch });
  };
  return function connector(Component: any) {
    const ConnectedComponent = forwardRef<any, any>((props, ref) => {
      return (
        <Consumer>
          {(store) => (
            <Component {...mapper(store, props)} {...props} ref={ref}>
              {props.children}
            </Component>
          )}
        </Consumer>
      );
    }) as ConnectedComponent<any, any, any>;
    ConnectedComponent.WrappedComponent = Component;
    hoistNonReactStatics(ConnectedComponent, Component);
    return ConnectedComponent;
  };
}
