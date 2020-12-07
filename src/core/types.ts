/*
 * @since 2020-11-28 10:41:23
 * @author acrazing <joking.young@gmail.com>
 */

export type JSONState<S> = S extends { toJSON(): infer R }
  ? JSONState<R>
  : S extends object
  ? {
      [P in keyof S]: JSONState<S[P]>;
    }
  : S;

export interface JSONSerializable<S> {
  toJSON(): S;
  fromJSON(state: JSONState<S>): this;
}

export function isJSONSerializable(obj: any): obj is JSONSerializable<any> {
  return !!obj && 'fromJSON' in obj;
}

export function fromJSON<S>(preloadedState: JSONState<S>, state: S): S {
  if (isJSONSerializable(state)) {
    return state.fromJSON(preloadedState);
  }
  return preloadedState as S;
}
