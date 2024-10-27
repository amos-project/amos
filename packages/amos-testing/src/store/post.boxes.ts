/*
 * @since 2022-01-06 11:59:48
 * @author junbao <junbao@moego.pet>
 */

import { listMapBox, recordMapBox } from 'amos-boxes';
import { pagedListMapBox } from 'amos-io';
import { Record } from 'amos-shapes';

export interface PostModel {
  id: number;
  title: string;
  content: string;
  createTime: number;
  authorId: number;
}

export class PostRecord extends Record<PostModel>({
  id: 0,
  title: '',
  content: '',
  createTime: 0,
  authorId: 0,
}) {}

export const postMapBox = recordMapBox('posts', PostRecord, 'id');

export const userPostListBox = pagedListMapBox('posts.userPostList', 0, 0, 0);

export interface MediaModel {
  id: number;
  userId: number;
  postId: number;
  type: string;
  url: string;
}

export class MediaRecord extends Record<MediaModel>({
  id: 0,
  userId: 0,
  postId: 0,
  type: '',
  url: '',
}) {}

export const mediaMapBox = recordMapBox('postMedias', MediaRecord, 'id');

export const postMediaListBox = listMapBox('postMedias.postMediaList', 0, 0);
