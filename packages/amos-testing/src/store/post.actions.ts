/*
 * @since 2022-01-11 17:53:58
 * @author junbao <junbao@moego.pet>
 */

import {
  mediaMapBox,
  postMapBox,
  postMediaListBox,
  selectUserId,
  userPostListBox,
} from 'amos-testing';
import { createHttpAction } from '../createHttpAction';
import { createPagedListAction } from '../createPagedListAction';

export const getUserPostList = createPagedListAction({});

export const addPost = createHttpAction({
  key: 'POST/posts.addPost',
  // TODO: consider unshift in userPostListBox?
  mutations: (select, r) => postMapBox.mergeItem(r),
});

export const updatePost = createHttpAction({
  key: 'PUT/posts.updatePost',
  optimistic: true,
  mutations: (select, result, args) => postMapBox.mergeItem(args),
});

export const removePost = createHttpAction({
  key: 'DELETE/posts.deletePost',
  optimistic: true,
  mutations: (select, result, args) => [
    postMapBox.removeItem(args.id),
    userPostListBox.deleteAt(select(selectUserId()), args.id),
  ],
});

export const getPost = createHttpAction({
  key: 'GET/posts.getPost',
  mutations: (select, r) => postMapBox.mergeItem(r),
});

export const getPostMediaList = createHttpAction({
  key: 'GET/postMedias.getPostMediaList',
  mutations: (select, result, args) => [
    mediaMapBox.mergeAll(result),
    postMediaListBox.setItem(
      args.postId,
      result.map((r) => r.id),
    ),
  ],
});

export const getPostMedia = createHttpAction({
  key: 'GET/postMedias.getPostMedia',
  mutations: (select, r) => mediaMapBox.mergeItem(r),
});

export const updatePostMedia = createHttpAction({
  key: 'PUT/postMedias.updatePostMedia',
  optimistic: true,
  mutations: (select, result, args) => mediaMapBox.mergeItem(args),
});

export const addPostMedia = createHttpAction({
  key: 'POST/postMedias.addPostMedia',
  mutations: (select, r) => [postMediaListBox.pushAt(r.postId, r.id), mediaMapBox.mergeItem(r)],
});

export const removePostMedia = createHttpAction({
  key: 'DELETE/postMedias.deletePostMedia',
  optimistic: true,
  mutations: (select, result, args) => [
    postMediaListBox.deleteAt(select(mediaMapBox.getItem(args.id)).postId, args.id),
    mediaMapBox.removeItem(args.id),
  ],
});
