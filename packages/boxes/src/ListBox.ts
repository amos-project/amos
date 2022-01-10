/*
 * @since 2021-12-31 12:11:47
 * @author junbao <junbao@moego.pet>
 */

import { Box, Mutation } from 'amos-core';
import { List, ListElement } from 'amos-shapes';

export class ListBox<L extends List<any>> extends Box<L> {}

export function createListBox<E>(key: string, defaultElement: E): ListBox<List<E>> {
  return new ListBox<List<E>>(key, new List(defaultElement));
}
