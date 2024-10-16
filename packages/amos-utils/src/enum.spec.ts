/*
 * @since 2022-01-08 11:37:22
 * @author junbao <junbao@moego.pet>
 */

import { TodoStatus } from 'amos-testing';
import { EnumKeys, EnumLabels, EnumValues } from './enum';

describe('Enum', () => {
  it('should createEnum', () => {
    // @ts-expect-error
    TodoStatus.created === 5;
    expect([
      TodoStatus.created,
      TodoStatus.started,
      TodoStatus.finished,
      TodoStatus.deleted,
    ]).toEqual([1, 2, 3, 4]);
    expect([
      TodoStatus.label(TodoStatus.created).group,
      TodoStatus.label(TodoStatus.started).group,
      // @ts-expect-error
      TodoStatus.label(TodoStatus.finished).foo,
      TodoStatus.label(TodoStatus.deleted).group,
    ]).toEqual(['TODO', 'IN PROGRESS', void 0, 'BACKLOG']);
    const types: [
      EnumKeys<typeof TodoStatus>[],
      EnumValues<typeof TodoStatus>[],
      EnumLabels<typeof TodoStatus>[],
    ] = [
      [
        'created',
        'started',
        'finished',
        'deleted',
        TodoStatus.key(TodoStatus.created),
        // @ts-expect-error
        'foo',
      ],
      [
        1,
        2,
        3,
        4,
        TodoStatus.created,
        // @ts-expect-error
        5,
      ],
      [
        {
          group: 'something',
          // @ts-expect-error
          foo: 'bar',
        },
        TodoStatus.label(TodoStatus.created),
      ],
    ];
    expect(types).toBeDefined();
  });
});
