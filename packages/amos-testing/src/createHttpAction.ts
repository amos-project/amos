/*
 * @since 2022-01-16 11:17:09
 * @author junbao <junbao@moego.pet>
 */

import { ActionFactory } from 'amos-core';
import { AsyncActionOptions, createAsyncActionFactory } from 'amos-io';
import { HttpEndpoints, mockServer } from './HttpEndpoints';

export interface HttpActionOptions<K extends keyof HttpEndpoints>
  extends AsyncActionOptions<[HttpEndpoints[K]['Req']], HttpEndpoints[K]['Res']> {
  key: K;
}

export const createHttpAction: <K extends keyof HttpEndpoints>(
  options: HttpActionOptions<K>,
) => ActionFactory<[input: HttpEndpoints[K]['Req']], Promise<HttpEndpoints[K]['Res']>> =
  createAsyncActionFactory(async (options: HttpActionOptions<any>, req: any) => {
    return (mockServer as any)[options.key](req);
  });
