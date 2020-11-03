/*
 * @since 2020-11-03 16:25:01
 * @author acrazing <joking.young@gmail.com>
 */

declare const __magicType: unique symbol;

type JSONValue<R> = R extends { [__magicType]: infer E } ? E : R;

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

export interface Box<S = any> {
  key: string;
  initialState: S | (() => S);
  preload: (state: S, preloadedState: JSONState<S>) => S;
}

export type BoxState<B> = B extends Box<infer S> ? S : never;

export function box<S>(
  key: string,
  initialState: S | (() => S),
  preload: (state: S, preloadedState: JSONState<S>) => S,
): Box<S> {
  return { key, initialState, preload };
}

export interface Atom<S = any, A = any> {
  object: 'atom';
  action: A;
  factory: AtomFactory<S, A>;
}

export interface AtomFactory<S = any, A = any> {
  type: string;
  box: Box<S>;
  atom: (state: S, action: A) => S;
  (action: A): Atom<S, A>;
}

export function atom<S, A>(
  box: Box<S>,
  atom: (state: S, action: A) => S,
  type: string = atom.name,
): AtomFactory<S, A> {
  const factory = Object.assign(
    (action: A): Atom<S, A> => ({
      object: 'atom',
      action,
      factory,
    }),
    { box, type, atom },
  );
  return factory;
}
