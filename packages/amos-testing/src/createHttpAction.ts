/*
 * @since 2022-01-16 11:17:09
 * @author junbao <junbao@moego.pet>
 */

import { action, ActionFactory } from 'amos-core';
import { NotImplemented } from 'amos-utils';
import { HttpEndpoints } from './HttpEndpoints';

export interface HttpActionOptions<K extends keyof HttpEndpoints> {
  key: K;
  optimistic?: boolean;
  mutations: (...args: any[]) => any;
}

export const createHttpAction: <K extends keyof HttpEndpoints>(
  options: HttpActionOptions<K>,
) => ActionFactory<[input: HttpEndpoints[K]['Req']], Promise<HttpEndpoints[K]['Res']>> = () => {
  return action(
    () => {
      throw new NotImplemented();
    },
    {
      type: Math.random() + '',
    },
  ) as any;
};
