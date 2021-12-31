/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { Box } from 'amos';
import { useSelector } from 'amos-react';
import { UserModel } from 'amos-testing';
import { Entity } from './Entity';
import { Rick, UserEntity } from './Entity.spec';
import { createEntityMapBox, EntityMap } from './EntityMap';

export const userMapBox = createEntityMapBox(
  'user.userMap',
  new EntityMap(new UserEntity(), 'id'),
).relations({
  father: ['fatherId', (): Box<EntityMap<UserEntity, 'id'>> => userMapBox],
  mother: ['motherId', (): Box<EntityMap<UserEntity, 'id'>> => userMapBox],
});

export class PostEntity extends Entity({
  id: 0,
  title: '',
  content: '',
  createTime: 0,
  authorId: 0,
}) {}

export const postMapBox = createEntityMapBox(
  'post.postMap',
  new EntityMap(new PostEntity(), 'id'),
).relations({
  author: ['authorId', userMapBox],
});

export class MediaEntity extends Entity({
  id: 0,
  userId: 0,
  postId: 0,
  type: '',
  url: '',
}) {}

export const mediaMapBox = createEntityMapBox(
  'post.mediaMap',
  new EntityMap(new MediaEntity(), 'id'),
).relations({
  post: ['postId', postMapBox],
  user: ['userId', userMapBox],
});

export function testTypes() {
  const ANY: any = void 0;
  userMapBox.getFather(0);
  postMapBox.getAuthor(0);
  postMapBox.getAuthorFather(0);
  postMapBox.getAuthor(0).factory.compute(ANY, 0).fullName();
  mediaMapBox.getPost(0).factory.compute(ANY, 0).title;
  mediaMapBox.getPostAuthor(1).factory.compute(ANY, 0).fullName();
  mediaMapBox.getPostAuthorFather(1);
  mediaMapBox.getPostAuthorMother(1);
  mediaMapBox.getUser(0);

  mediaMapBox.related(1, 'post', 'author', 'father', 'father');

  const [father] = useSelector(mediaMapBox.getPostAuthorFather(1));
  console.log(father.fullName());

  // @ts-expect-error
  postMapBox.getAuthor(0).factory.compute(ANY, 0).fullName().foo;
  // @ts-expect-error
  mediaMapBox.getPost(0).factory.compute(ANY, 0).title.foo;
  // @ts-expect-error
  mediaMapBox.getPostAuthor(1).factory.compute(ANY, 0).fullName().foo;
  // @ts-expect-error
  mediaMapBox.getPostAuthorFather(1).foo;
}

describe('EntityMap', () => {
  it('should create EntityMap', () => {
    userMapBox.merge(Rick.id, Rick.toJSON());
    userMapBox.merge;
  });
});

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
