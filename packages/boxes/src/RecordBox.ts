/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, BoxOptions, Mutation, Selector } from 'amos-core';
import { Record, RecordProps } from 'amos-shapes';
import { CtorValue } from 'amos-utils';

export class RecordBox<P extends object, R extends Record<P>> extends Box<R> {
  get: <K extends keyof P>(key: K) => Selector<[K], P[K]> = this.selector('get');

  set: <K extends keyof P>(key: K, value: P[K]) => Mutation<[K, P[K]], R> = this.mutation('set');

  update: <K extends keyof P>(
    key: K,
    updater: (value: P[K]) => P[K],
  ) => Mutation<[K, (value: P[K]) => P[K]], R> = this.mutation('update');

  isValid: () => Selector<[], boolean> = this.selector('isValid');
}

export function createRecordBox<R extends Record<any>>(
  key: string,
  initialState: CtorValue<R>,
  options?: BoxOptions<R>,
): RecordBox<RecordProps<R>, R> {
  return new RecordBox(
    key,
    typeof initialState === 'function' ? new initialState() : initialState,
    options,
  );
}
