/*
 * @since 2024-10-26 11:57:54
 * @author junbao <junbao@moego.pet>
 */

import { Action, action, ActionFactoryStatic, Dispatch, Select } from 'amos-core';
import { FetchError, fetchRequest, RequestOptions, RequestResult } from './fetch.request';
import { requestConfigBox } from './request.boxes';
import { selectRequestConfig } from './request.selectors';

export const updateRequestConfig = action(
  (dispatch, select, options: Partial<RequestOptions<any>>) => {
    return dispatch(requestConfigBox.mergeState(options));
  },
);

export const prependRequestErrorHandler = action(
  (dispatch, select, handler: (info: FetchError<any>) => boolean) => {
    const onError = select(selectRequestConfig()).onError;
    dispatch(
      updateRequestConfig({
        onError: onError
          ? (info) => {
              if (!handler(info)) {
                onError(info);
              }
            }
          : handler,
      }),
    );
  },
);

export interface Request extends ActionFactoryStatic {
  <O, I extends object = {}>(
    options: RequestOptions<I>,
  ): Action<[RequestOptions<I>], Promise<RequestResult<O>>>;
}

function doRequest(dispatch: Dispatch, select: Select, options: RequestOptions<any>) {
  return fetchRequest({ ...select(selectRequestConfig()), ...options });
}

export const request: Request = action(doRequest) as Request;

export interface RequestAlias<T extends 'query' | 'data' = 'query' | 'data'>
  extends ActionFactoryStatic {
  <O, I extends object = {}>(
    url: string,
    data: I,
    options?: Omit<RequestOptions<I>, T | 'url' | 'method'>,
  ): Action<[RequestOptions<I>], Promise<RequestResult<O>>>;
}

export const GET: RequestAlias = action(
  (dispatch, select, url: string, query: any, options: Partial<RequestOptions<any>> = {}) => {
    return doRequest(dispatch, select, Object.assign({ url, query, method: 'GET' }, options));
  },
) as RequestAlias;

export const HEAD: RequestAlias = action(
  (dispatch, select, url: string, query: any, options: Partial<RequestOptions<any>> = {}) => {
    return doRequest(dispatch, select, Object.assign({ url, query, method: 'HEAD' }, options));
  },
) as RequestAlias;

export const POST: RequestAlias<'data'> = action(
  (dispatch, select, url: string, data: any, options: Partial<RequestOptions<any>> = {}) => {
    return doRequest(dispatch, select, Object.assign({ url, data, method: 'POST' }, options));
  },
) as RequestAlias<'data'>;

export const PUT: RequestAlias<'data'> = action(
  (dispatch, select, url: string, data: any, options: Partial<RequestOptions<any>> = {}) => {
    return doRequest(dispatch, select, Object.assign({ url, data, method: 'PUT' }, options));
  },
) as RequestAlias<'data'>;

export const DELETE: RequestAlias<'data'> = action(
  (dispatch, select, url: string, data: any, options: Partial<RequestOptions<any>> = {}) => {
    return doRequest(dispatch, select, Object.assign({ url, data, method: 'DELETE' }, options));
  },
) as RequestAlias<'data'>;

export const PATCH: RequestAlias<'data'> = action(
  (dispatch, select, url: string, data: any, options: Partial<RequestOptions<any>> = {}) => {
    return doRequest(dispatch, select, Object.assign({ url, data, method: 'PATCH' }, options));
  },
) as RequestAlias<'data'>;
