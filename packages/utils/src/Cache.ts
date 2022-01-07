/*
 * @since 2022-01-06 18:53:57
 * @author junbao <junbao@moego.pet>
 */

export interface Cache<T> {
  get(id: string): T | undefined;
  set(id: string, value: T): void;
  delete(id: string): void;
}
