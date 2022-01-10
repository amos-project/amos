/*
 * @since 2021-12-31 12:11:29
 * @author junbao <junbao@moego.pet>
 */

import { currentUserBox, Morty } from 'amos-testing';
import { ANY } from 'amos-utils';

describe('RecordBox', function () {
  it('should create RecordBox', function () {
    currentUserBox.get('firstName').factory.compute(ANY, ANY);
    // @ts-expect-error
    currentUserBox.get('unknownField');
    currentUserBox.set('firstName', Morty.firstName);
    currentUserBox.update('lastName', (value) => value.repeat(2));
    currentUserBox.isValid();
  });
});