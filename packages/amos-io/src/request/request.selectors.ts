/*
 * @since 2024-10-26 11:58:06
 * @author junbao <junbao@moego.pet>
 */
import { selector } from 'amos-core';
import { requestConfigBox } from './request.boxes';

export const selectRequestConfig = selector((select) => select(requestConfigBox));
