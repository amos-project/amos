/*
 * @since 2020-11-03 16:25:01
 * @author acrazing <joking.young@gmail.com>
 */

import { BoxPersistOptions } from 'amos-persist';
import {
  AmosObject,
  createAmosObject,
  type FuncReturn,
  type ID,
  is,
  IsAny,
  type IsNoType,
  must,
  resolveFuncValue,
  toFunc,
  Unsubscribe,
  ValueOrFunc,
} from 'amos-utils';
import { Selector, SelectorFactory, SelectorOptions } from './selector';
import { SignalFactory } from './signal';
import { Select } from './types';

/**
 * A mutation is an object which will used to update the state of a mutation.
 * Mutation can only be created by a {@link MutationFactory} which is
 * defined when create a box class by {@link BoxFactory.extends}.
 *
 * The {@link AmosObject.id} of a mutation should be the '<box.id>/<method>',
 * which is used for distinguish the mutation kind.
 */
export interface Mutation<S = any> extends AmosObject<'mutation'> {
  /**
   * The type of the mutation, it should match the form: `<box.key>/<method>`.
   */
  type: string;
  /**
   * The mutator is used for generate the new state of the box, the return value
   * of mutator will be used as the new state of the box.
   */
  mutator: (state: S) => S;
  /**
   * The args of the mutation, which is used for devtools to track, {@link mutator}
   * doesn't need this as can use the closure to obtain the args.
   */
  args: readonly unknown[];
  /**
   * The target box to mutate.
   */
  box: Box<S>;
}

/**
 * A mutation factory is used to generate a {@link Mutation}, you may not need to
 * use this type, but use {@link Box.extends} to implement mutation factory.
 */
export interface MutationFactory<A extends any[] = any, S = any> {
  (...args: A): Mutation<S>;
}

/**
 * @see BoxOptions.table
 */
export interface TableOptions<S = any> {
  /**
   * Covert the state to rows map, used for compute updated rows.
   * The time complexity is O(M + N), M and N is the old and new
   * state's key count.
   * TODO: optimize to get the updated rows exactly.
   */
  toRows: (state: S) => Readonly<Record<string, unknown>>;

  /**
   * Get a row from current state
   */
  getRow: (state: S, rowId: ID) => boolean;

  /**
   * Merge the persisted state to current state.
   * Please note the incoming rows are JSON serialized and deserialized.
   */
  hydrate: (current: S, incoming: Readonly<Record<string, unknown>>) => S;
}

export interface BoxOptions<S = any> {
  /**
   * Table options is used for {@link withPersist} to determine a box is multiple
   * rows or not. If a box multi-row. It will be persisted and loaded row by row.
   *
   * You may refer to {@link SelectorOptions.loadRow} to see how to determine which
   * row should be loaded.
   *
   * The only one built-in multi-row box class is {@link MapBox}. This also includes
   * all classes that extends it. Including {@link ListMapBox} and {@link RecordMapBox}.
   */
  table?: TableOptions<S>;

  /**
   * Persist config, if false, will never been persisted, if not set,
   * will be persisted with version=1 if matched by {@link PersistOptions.includes},
   * else, will be persisted by specified version.
   */
  persist?: BoxPersistOptions<S> | false;
}

export interface Box<S = any> extends AmosObject<'box'>, Readonly<BoxOptions<S>> {
  /**
   * The key of the box, all the boxes in a system should have a unique key.
   * We recommend `appName.moduleName.typeName` style keys. For example:
   * 'myApp.blogs.userBlogList'.
   *
   * Note: you cannot use the following chars in box key: ":/".
   *
   * Please note amos has some internal boxes, whose keys are started with 'amos.'.
   */
  readonly key: string;

  /**
   * The initial state of the box.
   */
  readonly getInitialState: () => S;

  /**
   * Update options of the box.
   */
  config(options: ValueOrFunc<Partial<BoxOptions<S>>, [box: this, initialState: S]>): this;

  /**
   * A helper function to allow you to change the initialState of the box.
   */
  setInitialState(initialState: ValueOrFunc<S, [S]>): this;

  /**
   * Reset state to {@link BoxOptions.initialState}.
   */
  setState(): Mutation<S>;
  /**
   * Replace state
   */
  setState(state: S): Mutation<S>;
  /**
   * Replace state with the return value of the function
   */
  setState(next: (state: S) => S): Mutation<S>;

  /**
   * Listen to a {@link Signal} to update its state.
   */
  subscribe<T>(signal: SignalFactory<any, T>, fn: (state: S, data: T) => S): Unsubscribe;
}

export type BoxState<B extends Box> = B extends Box<infer S> ? S : never;

export interface BoxFactoryStatic<B extends Box> {
  /**
   * Create a new box class inherit the current box and implement the specifications.
   *
   * The reason we use factory instead of class mode is that class constructor is hard
   * to infer the state type, and we want to unify the box instantiation format.
   */
  extends<NB extends Box>(options: BoxFactoryOptions<NB, B>): BoxFactory<NB>;
}

export interface BoxFactory<B extends Box = Box> extends BoxFactoryStatic<B> {
  get(key: string): Box;
  new (key: string, initialState: ValueOrFunc<BoxState<B>>): B;
}

export interface BoxFactoryMutationOptions<B extends Box, A extends any[] = any> {
  /**
   * The method to calculate the new state of the box.
   */
  update: (box: B, state: BoxState<B>, ...args: A) => BoxState<B>;
}

export interface BoxFactorySelectorOptions<S = any, A extends any[] = any, R = any>
  extends Partial<SelectorOptions<A, R>> {
  /**
   * The method to calculate the selected state.
   */
  derive?: (state: S, ...args: A) => R;
}

export interface BoxFactoryOptions<TBox extends Box, TParentBox = {}> {
  /**
   * The name of the new box class.
   */
  name: string;
  /**
   * The mutations of the box, it should be constrained by the shape of the box.
   * You can use 3 format:
   * - null: the mutation will call the same name method on the state directly to get new state.
   *         e,g, {@link MapBox}.
   * - function: use the function as the mutator to generate new state directly. It will
   *         be called with the form: (currentState, ...args). e,g, {@link BoolBox}.
   * - a {@link BoxFactoryMutationOptions}: which allows you to define the mutator with the box
   *         instance. e,g, {@link Box}.
   */
  mutations: {
    [P in keyof TBox as IsAny<TBox[P]> extends true
      ? never
      : TBox[P] extends MutationFactory
        ? IsAny<FuncReturn<TBox[P]>> extends true
          ? never
          : P extends keyof TParentBox
            ? never
            : P
        : never]: TBox[P] extends MutationFactory<infer A, BoxState<TBox>>
      ?
          | null
          | ((state: BoxState<TBox>, ...args: A) => BoxState<TBox>)
          | BoxFactoryMutationOptions<TBox, A>
      : never;
  };
  /**
   * The selectors of the box, you should only implement the selectors the box class owned only.
   *
   * You can use 3 format:
   * - null: call the same name method on the state to select. e,g, {@link ListBox}.
   * - {@link BoxFactorySelectorOptions} object: define the selector options. e,g, {@link ListBox}.
   * - function: get the options with a function accept box is the parameter. e,g, {@link MapBox}.
   */
  selectors: {
    [P in keyof TBox as IsNoType<TBox[P]> extends true
      ? never
      : TBox[P] extends (...args: infer A) => infer S
        ? IsNoType<S> extends true
          ? never
          : P extends keyof TParentBox
            ? never
            : S extends Selector
              ? P
              : never
        : never]: TBox[P] extends (...args: infer A) => Selector<any, infer R>
      ? null | ValueOrFunc<BoxFactorySelectorOptions<BoxState<TBox>, A, R>, [TBox]>
      : never;
  };
  /**
   * The options to apply to all the instance of the box class. e,g, {@link MapBox}.
   */
  options?: Partial<BoxOptions>;
  /**
   * The methods attach to the box proto.
   */
  methods?: Partial<TBox>;
}

const boxMap = new Map<string, Box>();

function createBoxFactory<B extends Box, SB = {}>(
  { mutations, selectors, name, options = {}, methods = {} }: BoxFactoryOptions<B, SB>,
  Parent?: BoxFactory<any>,
): BoxFactory<B> {
  const Box: BoxFactory<any> = Parent
    ? class DerivedBox extends Parent {
        constructor(key: string, initialState: any) {
          super(key, initialState);
        }
      }
    : class Box {
        public getInitialState: () => any;

        constructor(
          public key: string,
          initialState: any,
        ) {
          must(!key.includes(':') && !key.includes('/'), 'box key should not contain `:/`');
          this.getInitialState = toFunc(initialState);
          boxMap.set(key, this as any);
          createAmosObject('box', this);
        }

        static get(key: string) {
          const box = boxMap.get(key);
          must(box, `missing box for key ${key}`);
          return box;
        }

        static extends(options: BoxFactoryOptions<any>) {
          return createBoxFactory(options, this);
        }

        config(options: ValueOrFunc<Partial<BoxOptions>, [this]>) {
          return Object.assign(this, resolveFuncValue(options, this));
        }

        setInitialState(initialState: ValueOrFunc<unknown, [unknown]>) {
          const original = this.getInitialState;
          this.getInitialState = () => resolveFuncValue(initialState, original());
          return this;
        }

        subscribe<D>(this: B, signal: SignalFactory<any, D>, fn: (state: any, data: D) => any) {
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
          id: `${this.id}/${k as string}`,
          key: `${this.key}/${k as string}`,
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
          id: `${this.id}/${k as string}`,
          key: `${this.key}/${k as string}`,
          type: `${this.key}/${k as string}`,
          compute: (select: Select) => derive(select(this), ...args),
          args: args,
        });
      },
    });
  }
  for (const k in options) {
    Object.defineProperty(Box.prototype, k, {
      value: options[k as keyof BoxOptions],
      writable: true,
      configurable: true,
    });
  }
  for (const k in methods) {
    Object.defineProperty(Box.prototype, k, { value: methods[k] });
  }
  Object.defineProperty(Box, 'name', { value: name });
  return Box;
}

export const Box: BoxFactory = createBoxFactory<Box>({
  name: 'Box',
  mutations: {
    setState: {
      update: (box, state, ...args) => {
        return args.length ? resolveFuncValue(args[0], state) : box.getInitialState();
      },
    },
  },
  selectors: {},
});

export function box<S>(key: string, initialState: ValueOrFunc<S>): Box<S> {
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
