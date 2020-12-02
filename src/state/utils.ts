/*
 * @since 2020-11-28 11:19:34
 * @author acrazing <joking.young@gmail.com>
 */

const FORKABLE_PROTO_KEY =
  typeof Symbol === 'function' ? Symbol('FORKABLE_PROTO') : 'Symbol(FORKABLE_PROTO)';

function isDied() {
  throw new Error('This object is died, please use the newest one instead.');
}

function createForkProto(proto: any): any {
  const parent = Object.getPrototypeOf(proto);
  const parentForkProto =
    !parent || parent === Object.prototype
      ? parent
      : parent.hasOwnProperty(FORKABLE_PROTO_KEY)
      ? parent[FORKABLE_PROTO_KEY]
      : createForkProto(parent);
  const forkProto = Object.create(parentForkProto);
  Object.getOwnPropertyNames(proto).forEach((key) =>
    Object.defineProperty(forkProto, key, { get: isDied }),
  );
  Object.getOwnPropertySymbols?.(proto).forEach((key) =>
    Object.defineProperty(forkProto, key, { get: isDied }),
  );
  Object.defineProperty(proto, FORKABLE_PROTO_KEY, forkProto);
  return forkProto;
}

export function forkable(clazz: new (...args: any[]) => any): void {
  createForkProto(clazz.prototype);
}

export function fork<T>(obj: T): T {
  const newObj = Object.create(Object.getPrototypeOf(obj));
  Object.assign(newObj, obj);
  Object.setPrototypeOf(obj, (obj as any)[FORKABLE_PROTO_KEY]);
  return newObj;
}
