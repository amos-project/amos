/*
 * @since 2020-11-03 16:25:01
 * @author acrazing <joking.young@gmail.com>
 */

declare const __magicType: unique symbol;

export type JSONValue<R> = R extends { [__magicType]: infer E } ? E : R;

export type JSONState<S> = JSONValue<
  S extends { toJSON(): infer R }
    ? { [__magicType]: JSONState<R> }
    : S extends (infer E)[]
    ? { [__magicType]: JSONState<E>[] }
    : S extends object
    ? {
        [P in keyof S]: JSONState<S[P]>;
      }
    : S
>;

export type Mutator<S, A> = (state: S, action: A) => S;

export type MutatorSet<S> = Record<string, Mutator<S, any>>;

export type Box<S = any, MS extends MutatorSet<S> = any> = {
  object: 'box';
  state: S;
} & {
  [P in keyof MS]: MS[P] extends Mutator<S, infer A> ? (action: A) => A : never;
};

export interface BoxOptions<S = any, MS extends MutatorSet<S> = any> {
  preload: (state: S, preloadedState: JSONState<S>) => S;
  mutators: MS;
}

export interface BoxFactory<S = any, MS extends MutatorSet<S> = any>
  extends BoxOptions<S, MS> {
  object: 'box_factory';
  key: string;
  initialState: S;
}

export type BoxType<BF extends BoxFactory> = BF extends BoxFactory<
  infer S,
  infer MS
>
  ? Box<S, MS>
  : never;

/**
 * create a store box factory
 * @param key - the key should be unique in a context
 * @param initialState - the initial state
 * @param options - options
 */
export function box<S, MS extends MutatorSet<S>>(
  key: string,
  initialState: S,
  options: BoxOptions<S, MS>,
): BoxFactory<S, MS> {
  throw new Error('TODO');
}
