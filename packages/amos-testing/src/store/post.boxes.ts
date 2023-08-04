/*
 * @since 2022-01-06 11:59:48
 * @author junbao <junbao@moego.pet>
 */

import { createListMapBox, createPagedListMapBox, createRecordMapBox } from 'amos-boxes';
import { Record } from 'amos-shapes';
import { userMapBox } from './user.boxes';

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

export const postMapBox = createRecordMapBox('posts', PostRecord, 'id').relations({
  author: ['authorId', userMapBox],
});

export const userPostListBox = createPagedListMapBox('posts.userPostList', 0, 0, 0);

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

export const mediaMapBox = createRecordMapBox('postMedias', MediaRecord, 'id').relations({
  post: ['postId', postMapBox],
  user: ['userId', userMapBox],
});

export const postMediaListBox = createListMapBox('postMedias.postMediaList', 0, 0);
