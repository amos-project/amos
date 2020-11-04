/*
 * @since 2020-11-04 11:12:36
 * @author acrazing <joking.young@gmail.com>
 */

export function arrayEqual<T>(a: T[], b: T[]) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

export const isArray: (args: any) => args is any[] | readonly any[] = Array.isArray;

export type FlatPromise<R extends any[]> = {
  [P in keyof R]: R[P] extends PromiseLike<any> ? true : never;
}[keyof R] extends true
  ? {
      [P in keyof R]: R[P] extends PromiseLike<infer U> ? U : R[P];
    }
  : R;

export function flatPromise<R extends any[]>(input: R): FlatPromise<R> {
  return input.some((i) => 'then' in i && typeof i.then === 'function')
    ? Promise.all(input)
    : (input as any);
}
