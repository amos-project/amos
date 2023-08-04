/*
 * @since 2022-01-11 17:54:16
 * @author junbao <junbao@moego.pet>
 */

import { createPagedListActionFactory, PagedListActionOptions } from 'amos-io';
import { HttpEndpoints } from './HttpEndpoints';

export interface HttpPagedListActionOptions<
  K extends keyof HttpEndpoints,
  DI extends Partial<HttpEndpoints[K]['Req']>,
> extends PagedListActionOptions<
    [key: K, input: HttpEndpoints[K]['Req']],
    HttpEndpoints[K]['Res']
  > {
  key: K;
}

export const createPagedListAction = createPagedListActionFactory({});
