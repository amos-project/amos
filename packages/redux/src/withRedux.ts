/*
 * @since 2020-11-15 15:43:49
 * @author acrazing <joking.young@gmail.com>
 */

import { Dispatchable, Select, Selectable, StoreEnhancer } from 'amos';
import { Action, Store as ReduxStore } from 'redux';

declare module 'amos' {
  export interface Select {
    <R>(reduxSelector: (state: any) => R): R extends Selectable<infer SR> ? SR : R;
  }

  export interface Dispatch {
    <A extends Action>(action: A): A extends Dispatchable<infer R> ? R : A;
  }
}

declare module 'amos-react' {
  export type ReduxSelectable<R = any> = Selectable<R> | ((state: any) => R);

  export type ReduxMapSelector<Rs extends readonly ReduxSelectable[]> = {
    [P in keyof Rs]: Rs[P] extends ReduxSelectable<infer R> ? R : never;
  };

  // Please do not delete the following @ts-ignore, it is used for
  // suspense TS2384: Overload signatures must all be ambient or non-ambient
  // @ts-ignore
  export function useSelector<Rs extends ReduxSelectable[]>(...selectors: Rs): ReduxMapSelector<Rs>;
}

export function withRedux(reduxStore: ReduxStore): StoreEnhancer {
  return (StoreClass) => {
    return class WithReduxStore extends StoreClass {
      private reduxState: any;
      private originalSelect!: Select;

      init() {
        super.init();
        this.originalSelect = this.select;
        this.syncState();
        reduxStore.subscribe(this.syncState);
      }

      private syncState = () => {
        const nextReduxState = reduxStore.getState();
        if (nextReduxState === this.reduxState) {
          return;
        }
        this.reduxState = nextReduxState;
        this.select = Object.assign(
          (selectable: any) => this.originalSelect(selectable),
          nextReduxState,
        );
        this.notify();
      };
    };
  };
}
