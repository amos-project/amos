/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { UserModel } from 'amos-testing';
import { Entity } from './Entity';
import { UserEntity } from './Entity.spec';
import { createEntityMapBox, EntityMap } from './EntityMap';

export const UserMap = createEntityMapBox('user.map', new EntityMap(new UserEntity(), 'id'));

export class PostEntity extends Entity({
  id: 0,
  title: '',
  content: '',
  createTime: 0,
  authorId: 0,
}) {}

export const PostMap = createEntityMapBox(
  'post.map',
  new EntityMap(new PostEntity(), 'id'),
).relations({
  author: ['authorId', UserMap],
});

export class MediaEntity extends Entity({
  id: 0,
  postId: 0,
  type: '',
  url: '',
}) {}

export const MediaMap = createEntityMapBox(
  'post.media.map',
  new EntityMap(new MediaEntity(), 'id'),
).relations({
  post: ['postId', PostMap],
});

export function testTypes() {
  const ANY: any = void 0;
  PostMap.getAuthor(0).factory.compute(ANY, ANY).fullName();
  PostMap.$relations.author.toString();
  // @ts-expect-error
  PostMap.$relations.foo.toString();
  MediaMap.getPost(0).factory.compute(ANY, ANY).title;
  // @ts-expect-error
  MediaMap.getPost2(0).factory.compute(ANY, ANY).title;
  MediaMap.getPostAuthor(1);
}

describe('AmosRecordDict', () => {
  it('should create record dict', () => {
    const dict = new EntityMap(new UserModel(), 'id');
    dict.toJSON();
    dict.fromJSON({ 1: { id: 1 } as UserModel });
    dict.setRecords([new UserModel().merge({ id: 2 })]);
    dict.mergeRecords([{ id: 3 }]);
  });

  it('should create record dict box', () => {
    const box = createRecordDictBox('test/recordDict', new EntityMap(new UserModel(), 'id'));

    box.setRecords([new UserModel()]);
    box.mergeRecords([{ id: 1 }]);
    box.mergeItem(2, { id: 3 });
    box.get(4);
  });
});
