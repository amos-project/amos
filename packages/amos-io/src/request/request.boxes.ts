/*
 * @since 2024-10-26 11:57:59
 * @author junbao <junbao@moego.pet>
 */
import { objectBox } from 'amos-boxes';
import { RequestOptions } from './fetch.request';

export const requestConfigBox = objectBox<Partial<RequestOptions<any>>>('amos.request.config', {});
