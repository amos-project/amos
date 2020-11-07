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

export const identity = <T>(v: T) => v;

export function values<T extends object>(o: T): T[keyof T][] {
  return Object.keys(o).map((k) => o[k as keyof T]);
}
