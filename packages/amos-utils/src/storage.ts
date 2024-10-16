/*
 * @since 2022-01-08 10:32:44
 * @author junbao <junbao@moego.pet>
 */

/**
 * The storage engine, supports Storage in web and AsyncStorage in React Native.
 */
export interface StorageEngine {
  getItem(key: string): string | null | Promise<string | null> | undefined;
  setItem(key: string, value: string): void | Promise<void> | this;
  removeItem(key: string): void | Promise<void> | this;
  mergeItem?(key: string, value: string): void | Promise<void> | this;
  clear?(): void | Promise<void> | this;
}
