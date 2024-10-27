/*
 * @since 2024-10-26 11:57:42
 * @author junbao <junbao@moego.pet>
 */

import { isTruly, noop } from 'amos-utils';
import { composeSignal, toURLEncoded } from '../utils';

export interface FetchError<I extends object> extends Error {
  stage: 'fetch' | 'accept' | 'decode';
  options: RequestOptions<I>;
  request: Request;
  error: unknown;
  response: Response | undefined;
  data: any | undefined;
}

export interface RequestOptions<I extends object> extends RequestInit {
  url: string;
  data?: I;
  query?: I;
  requestType?: 'json' | 'urlencoded';
  responseType?: 'json' | 'text' | 'arrayBuffer' | 'blob' | 'formData' | 'ignore' | 'auto';
  accept?: (res: Response, req: Request) => boolean;
  onError?: (error: FetchError<I>) => void;
  timeout?: number;
  /**
   * If url is not started with https?://, will add this as prefix.
   */
  baseUrl?: string;
}

export interface RequestResult<O> extends Response {
  data: O;
}

const contentType = 'Content-Type';
const typeJson = 'application/json';
const typeUrlencoded = 'application/x-www-form-urlencoded';

export async function fetchRequest<I extends object, O>(
  options: RequestOptions<I>,
): Promise<RequestResult<O>> {
  const {
    url,
    data,
    query,
    responseType = 'auto',
    requestType = 'json',
    baseUrl,
    timeout = 60e3,
    onError = noop,
    accept = (res) => res.ok,
    ...init
  } = options;
  const headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers);
  init.headers = headers;
  if (data) {
    if (requestType === 'json') {
      init.body = JSON.stringify(data);
      headers.has(contentType) || headers.set(contentType, typeJson);
    } else if (requestType === 'urlencoded') {
      init.body = toURLEncoded(data);
      headers.has(contentType) || headers.set(contentType, typeUrlencoded);
    }
  }
  let finalUrl = url;
  if (query) {
    const search = toURLEncoded(query);
    if (search) {
      finalUrl += (finalUrl.includes('?') ? '?' : '') + search;
    }
  }
  if (baseUrl && !/^https?:\/\//i.test(finalUrl)) {
    finalUrl = baseUrl + finalUrl;
  }
  const timeoutController = new AbortController();
  const timeoutHandler = setTimeout(() => timeoutController.abort(new Error('Timeout')), timeout);
  init.signal = composeSignal([init.signal, timeoutController.signal].filter(isTruly));
  const req = new Request(finalUrl, init);
  let res: Response | undefined;
  let body: any;
  const throwError = (stage: FetchError<I>['stage'], e: unknown): never => {
    const err = Object.assign(new Error('Request error'), {
      name: 'RequestError',
      stage: stage,
      options: options,
      request: req,
      error: e,
      response: res,
      data: body,
    } as FetchError<I>);
    clearTimeout(timeoutHandler);
    onError(err);
    throw err;
  };
  try {
    res = await fetch(req);
  } catch (e) {
    throwError('fetch', e);
  }
  const resType = res!.headers.get(contentType) || '';
  const realType = resType.includes('json')
    ? 'json'
    : resType.includes('text')
      ? 'text'
      : 'arrayBuffer';
  const finalType = responseType === 'auto' ? realType : responseType;
  if (!accept(res!, req)) {
    if (realType === 'json' || realType === 'text') {
      body = await res![realType]().catch(noop);
    }
    throwError('accept', void 0);
  }
  if (finalType !== 'ignore') {
    try {
      body = await res![finalType]();
    } catch (e) {
      throwError('decode', e);
    }
  }
  clearTimeout(timeoutHandler);
  return Object.assign(res!, { data: body });
}
