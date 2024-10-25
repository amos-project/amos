/*
 * @since 2020-11-03 16:25:01
 * @author acrazing <joking.young@gmail.com>
 */

import { BoxPersistOptions } from 'amos-persist';
import {
  AmosObject,
  createAmosObject,
  is,
  IsAny,
  resolveFuncValue,
  toFunc,
  Unsubscribe,
  ValueOrFunc,
} from 'amos-utils';
import { Selector, SelectorFactory, SelectorOptions } from './selector';
import { SignalFactory } from './signal';
import { Select } from './types';

export type Mutator<S = any> = (state: S) => S;

export interface MutationOptions<S = any> {
  type: string;
  mutator: Mutator<S>;
}

export interface Mutation<S = any> extends AmosObject<'mutation'>, MutationOptions<S> {
  args: readonly unknown[];
  box: Box<S>;
}

export interface MutationFactory<A extends any[] = any, S = any> {
  (...args: A): Mutation<S>;
}

export interface TableOptions<S = any> {
  /**
   * Covert the state to rows map, used for compute updated rows.
   * The time complexity is O(M + N), M and N is the old and new
   * state's key count.
   * TODO: optimize to get the updated rows exactly.
   */
  toRows: (state: S) => Readonly<Record<string, unknown>>;
}

export interface BoxOptions<S = any> {
  initialState: S;
  /**
   * `table` is used for check a box is multiple row or not, is used for
   * {@link import('amos-persist').withPersist} to determine how to load
   * and persist a box's state.
   *
   * If this option is empty, persist with treat the entire box as a single
   * row, and use empty string as row id to persist and load.
   */
  table?: TableOptions<S>;

  /**
   * Persist config, if false, will never been persisted, if not set,
   * will be persisted with version=1 if matched by
   * {@link import('amos-persist').PersistOptions.includes}, else,
   * will be persisted by specified version.
   */
  persist?: BoxPersistOptions<S> | false;
}

export interface Box<S = any> extends AmosObject<'box'>, Readonly<BoxOptions<S>> {
  readonly key: string;

  config(options: ValueOrFunc<Partial<BoxOptions<S>>, [this]>): this;

  setState(): Mutation<S>;
  setState(state: S): Mutation<S>;
  setState(next: (state: S) => S): Mutation<S>;

  subscribe<T>(signal: SignalFactory<any, T>, fn: (state: S, data: T) => S): Unsubscribe;
}

export type BoxState<B extends Box> = B extends Box<infer S> ? S : never;

export interface BoxFactoryStatic<B extends Box> {
  extends<NB extends Box>(options: BoxFactoryOptions<NB, B>): BoxFactory<NB>;
}

export interface BoxFactory<B extends Box = Box> extends BoxFactoryStatic<B> {
  new (key: string, initialState: BoxState<B>): B;
}

export interface BoxFactoryMutationOptions<B extends Box, A extends any[] = any> {
  update: (box: B, state: BoxState<B>, ...args: A) => BoxState<B>;
}

export interface BoxFactorySelectorOptions<S = any, A extends any[] = any, R = any>
  extends Omit<Partial<SelectorOptions<A, R>>, 'type' | 'compute'> {
  derive?: (state: S, ...args: A) => R;
}

export interface BoxFactoryOptions<TBox extends Box, TParentBox = {}> {
  name: string;
  mutations: {
    [P in keyof TBox as IsAny<TBox[P]> extends true
      ? never
      : TBox[P] extends MutationFactory
        ? P extends keyof TParentBox
          ? never
          : P
        : never]: TBox[P] extends MutationFactory<infer A, BoxState<TBox>>
      ?
          | null
          | ((state: BoxState<TBox>, ...args: A) => BoxState<TBox>)
          | BoxFactoryMutationOptions<TBox, A>
      : never;
  };
  selectors: {
    [P in keyof TBox as IsAny<TBox[P]> extends true
      ? never
      : TBox[P] extends (...args: infer A) => Selector
        ? P extends keyof TParentBox
          ? never
          : P
        : never]: TBox[P] extends (...args: infer A) => Selector<any, infer R>
      ? null | ValueOrFunc<BoxFactorySelectorOptions<BoxState<TBox>, A, R>, [TBox]>
      : never;
  };
  options?: Partial<BoxOptions>;
}

function createBoxFactory<B extends Box, SB = {}>(
  { mutations, selectors, name, options = {} }: BoxFactoryOptions<B, SB>,
  Parent?: BoxFactory<any>,
): BoxFactory<B> {
  const Box: BoxFactory<any> = Parent
    ? class _Box extends Parent {
        constructor(key: string, initialState: any) {
          super(key, initialState);
        }
      }
    : class {
        constructor(
          public key: string,
          public initialState: any,
        ) {
          createAmosObject('box', this);
        }

        static extends(options: BoxFactoryOptions<any>) {
          return createBoxFactory(options, this);
        }

        config(options: ValueOrFunc<Partial<BoxOptions>, [this]>) {
          Object.assign(this, resolveFuncValue(options, this));
        }

        subscribe<D>(this: Box, signal: SignalFactory<any, D>, fn: (state: any, data: D) => any) {
          return signal.subscribe((dispatch, select, data) => {
            dispatch(this.setState(fn(select(this), data)));
          });
        }
      };
  for (const k in mutations) {
    Object.defineProperty(Box.prototype, k, {
      value: function (this: B, ...args: any[]): Mutation {
        const fn: (state: any, ...args: any[]) => any =
          typeof mutations[k] === 'function'
            ? mutations[k]
            : !mutations[k]
              ? (state: any, ...args: any[]) => state[k](...args)
              : (state: any, ...args: any[]) =>
                  (mutations[k] as BoxFactoryMutationOptions<B>).update(this, state, ...args);
        return createAmosObject<Mutation>('mutation', {
          type: `${this.key}/${k as string}`,
          mutator: (state: any) => fn(state, ...args),
          args: args,
          box: this,
        });
      },
    });
  }
  for (const k in selectors) {
    const options = toFunc(selectors[k] || ({} as BoxFactorySelectorOptions));
    Object.defineProperty(Box.prototype, k, {
      value: function (this: B, ...args: any[]) {
        const resolvedOptions = options(this);
        const derive = resolvedOptions.derive || ((state: any, ...args) => state[k](...args));
        return createAmosObject<Selector>('selector', {
          equal: is,
          ...resolvedOptions,
          id: this.id,
          type: `${this.key}/${k as string}`,
          compute: (select: Select) => derive(select(this), ...args),
          args: args,
        });
      },
    });
  }
  for (const k in options) {
    Object.defineProperty(Box.prototype, k, { value: options[k as keyof BoxOptions] });
  }
  Object.defineProperty(Box, 'name', { value: name });
  return Box;
}

export const Box: BoxFactory = createBoxFactory<Box>({
  name: 'Box',
  mutations: {
    setState: {
      update: (box, state, ...args) => {
        return args.length ? resolveFuncValue(args[0], state) : box.initialState;
      },
    },
  },
  selectors: {},
});

export function box<S>(key: string, initialState: S): Box<S> {
  return new Box(key, initialState);
}

export type ShapeBox<
  TShape,
  TMutationKeys extends keyof TShape,
  TSelectorKeys extends keyof TShape,
  KLimiter = TShape /* tricky for WebStorm go to definitions to shape method, if TypeScript allows P in keyof S & KM, this should be removed */,
> = {
  [P in keyof KLimiter & TMutationKeys]: TShape[P] extends (...args: infer A) => TShape
    ? MutationFactory<A, TShape>
    : never;
} & {
  [P in keyof KLimiter & TSelectorKeys]: TShape[P] extends (...args: infer A) => infer R
    ? SelectorFactory<A, R>
    : never;
};
