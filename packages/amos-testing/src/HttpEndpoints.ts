/*
 * @since 2022-01-16 11:18:48
 * @author junbao <junbao@moego.pet>
 */

import { PartialRequired, removeElement } from 'amos-utils';
import { MediaModel, PostModel } from './store/post.boxes';

export interface HttpEndpoints {
  'GET/posts.getUserPostList': {
    Req: { page?: number; size?: number; userId?: number };
    Res: { total: number; data: PostModel[] };
  };
  'GET/posts.getPost': {
    Req: { id: number };
    Res: PostModel;
  };
  'POST/posts.addPost': {
    Req: Pick<PostModel, 'title' | 'content'>;
    Res: PostModel;
  };
  'PUT/posts.updatePost': {
    Req: PartialRequired<Pick<PostModel, 'id' | 'title' | 'content'>, 'id'>;
    Res: {};
  };
  'DELETE/posts.deletePost': {
    Req: { id: number };
    Res: {};
  };
  'GET/postMedias.getPostMediaList': {
    Req: { postId: number };
    Res: MediaModel[];
  };
  'GET/postMedias.getPostMedia': {
    Req: { id: number };
    Res: MediaModel;
  };
  'POST/postMedias.addPostMedia': {
    Req: Pick<MediaModel, 'postId' | 'url' | 'type'>;
    Res: MediaModel;
  };
  'PUT/postMedias.updatePostMedia': {
    Req: PartialRequired<Pick<MediaModel, 'id' | 'url' | 'type'>, 'id'>;
    Res: {};
  };
  'DELETE/postMedias.deletePostMedia': {
    Req: { id: number };
    Res: {};
  };
}

const posts: Record<number, PostModel> = {};
const medias: Record<number, MediaModel> = {};
const postMedias: Record<number, number[]> = {};
const userPosts: Record<number, number[]> = {};
let currentUserId = 0;

export const mockServer: {
  [P in keyof HttpEndpoints]: (req: HttpEndpoints[P]['Req']) => HttpEndpoints[P]['Res'];
} = {
  'GET/postMedias.getPostMedia': (req) => medias[req.id],
  'GET/postMedias.getPostMediaList': (req) => postMedias[req.postId]?.map((id) => medias[id]) || [],
  'GET/posts.getPost': (req) => posts[req.id],
  'GET/posts.getUserPostList': (req) => ({
    total: userPosts[req.userId || currentUserId].length || 0,
    data: userPosts[req.userId || currentUserId].map((id) => posts[id]) || [],
  }),
  'POST/posts.addPost': (req) => {
    const id = Math.random();
    posts[id] = { ...req, id, authorId: currentUserId, createTime: Date.now() };
    (userPosts[currentUserId] ??= []).unshift(id);
    return posts[id];
  },
  'POST/postMedias.addPostMedia': (req) => {
    const id = Math.random();
    medias[id] = { id, userId: currentUserId, ...req };
    (postMedias[req.postId] ??= []).push(id);
    return medias[id];
  },
  'PUT/posts.updatePost': (req) => {
    posts[req.id] = { ...posts[req.id], ...req };
    return {};
  },
  'PUT/postMedias.updatePostMedia': (req) => {
    medias[req.id] = { ...medias[req.id], ...req };
    return {};
  },
  'DELETE/postMedias.deletePostMedia': (req) => {
    removeElement(postMedias[medias[req.id].id], req.id);
    delete medias[req.id];
    return {};
  },
  'DELETE/posts.deletePost': (req) => {
    removeElement(userPosts[posts[req.id].authorId], req.id);
    delete posts[req.id];
    return {};
  },
};
