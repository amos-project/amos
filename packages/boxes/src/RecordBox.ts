/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, Mutation, Selector } from 'amos-core';
import { Record, RecordProps } from 'amos-shapes';

export class RecordBox<S extends Record<any>> extends Box<S> {
  get: <K extends keyof RecordProps<S>>(key: K) => Selector<[K], S[K]> = this.selector('get');

  set: <K extends keyof RecordProps<S>>(key: K, value: S[K]) => Mutation<[K, S[K]], S> =
    this.mutation('set');

  update: <K extends keyof RecordProps<S>>(
    key: K,
    updater: (value: S[K]) => S[K],
  ) => Mutation<[K, (value: S[K]) => S[K]], S> = this.mutation('update');

  isValid: () => Selector<[], boolean> = this.selector('isValid');
}
