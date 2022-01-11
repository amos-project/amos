/*
 * @since 2022-01-06 11:59:48
 * @author junbao <junbao@moego.pet>
 */

import { createListMapBox, createRecordMapBox } from 'amos-boxes';
import { Record } from 'amos-shapes';
import { userMapBox } from 'amos-testing';

export class PostRecord extends Record({
  id: 0,
  title: '',
  content: '',
  createTime: 0,
  authorId: 0,
}) {}

export const postMapBox = createRecordMapBox('posts', PostRecord, 'id').relations({
  author: ['authorId', userMapBox],
});

export class MediaRecord extends Record({
  id: 0,
  userId: 0,
  postId: 0,
  type: '',
  url: '',
}) {}

export const mediaMapBox = createRecordMapBox('posts.medias', MediaRecord, 'id').relations({
  post: ['postId', postMapBox],
  user: ['userId', userMapBox],
});

export const postMediaListBox = createListMapBox('posts.medias.postMediaList', 0, 0);
