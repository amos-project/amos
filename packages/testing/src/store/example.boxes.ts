/*
 * @since 2022-01-10 19:51:44
 * @author junbao <junbao@moego.pet>
 *
 * record box
 */

import { createRecordBox } from 'amos-boxes';
import { Record } from 'amos-shapes';

export class ExampleRecord extends Record({
  title: '',
  content: '',
  link: '',
  count: 0,
}) {
  resolveType() {
    if (/^https?:\/\//.test(this.link)) {
      return 'http';
    }
    if (this.link) {
      return 'link';
    }
    return 'text';
  }
}

export const exampleBox = createRecordBox('example', ExampleRecord);
