/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import {
  implementMapDelegations,
  MapDelegateOperations,
  RecordMap,
  RecordProps,
} from 'amos-shapes';
import { IDKeyof } from 'amos-utils';
import { PagedList } from './PagedList';

export interface PagedListMap<V extends PagedList<any, any, any>>
  extends MapDelegateOperations<
    V['ownerId'],
    V,
    'delete',
    'getAll' | 'getPage',
    PagedList<any, any, any>
  > {}

export class PagedListMap<V extends PagedList<any, any, any>> extends RecordMap<
  V,
  'ownerId' & IDKeyof<RecordProps<V>>
> {}

implementMapDelegations(PagedListMap, { delete: 'set', getAll: 'get', getPage: 'get' }, RecordMap);
