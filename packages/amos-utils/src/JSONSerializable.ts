/*
 * @since 2022-01-06 17:19:05
 * @author junbao <junbao@moego.pet>
 */

export type JSONState<S> = S extends { toJSON(): infer R }
  ? JSONState<R>
  : S extends object
  ? S extends (...args: any[]) => any
    ? null
    : { [P in keyof S]: JSONState<S[P]> }
  : S;

export interface JSONSerializable<S> {
  toJSON(): S;
  fromJSON(state: JSONState<S>): this;
}

export function isJSONSerializable(obj: any): obj is JSONSerializable<any> {
  return !!obj && 'fromJSON' in obj;
}
