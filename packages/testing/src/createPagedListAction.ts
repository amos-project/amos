/*
 * @since 2022-01-11 17:54:16
 * @author junbao <junbao@moego.pet>
 */

import { createPagedListActionFactory, PagedListActionOptions } from 'amos-effects';
import { PartialRequired } from 'amos-utils';
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
    Req: PartialRequired<PostModel, 'id'>;
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
    Res: PostModel;
  };
  'POST/postMedias.addPostMedia': {
    Req: Pick<MediaModel, 'postId' | 'url' | 'type'>;
    Res: PostModel;
  };
  'PUT/postMedias.updatePostMedia': {
    Req: PartialRequired<MediaModel, 'id'>;
    Res: {};
  };
  'DELETE/postMedias.deletePostMedia': {
    Req: { id: number };
    Res: {};
  };
}

export interface HttpPagedListActionOptions<
  K extends keyof HttpEndpoints,
  DI extends Partial<HttpEndpoints[K]['Req']>,
> extends PagedListActionOptions<
    [key: K, input: HttpEndpoints[K]['Req']],
    HttpEndpoints[K]['Res']
  > {
  key: K;
}

export const createPagedListAction = createPagedListActionFactory({});
