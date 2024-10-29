/*
 * @since 2024-10-24 15:37:40
 * @author junbao <junbao@moego.pet>
 */

import { formatType, type TypeFormat } from './compiler';

describe('compiler utils', () => {
  it('should format type', () => {
    expect(
      Array<TypeFormat>(
        'lower_underscore',
        'UPPER_UNDERSCORE',
        'lowerCamelCase',
        'UpperCamelCase',
        'original',
      ).map((t) => [
        formatType('helloWorld', t),
        formatType('hello_world', t),
        formatType('HELLO_WORLD', t),
        formatType('HelloWorld', t),
      ]),
    ).toEqual([
      ['hello_world', 'hello_world', 'hello_world', 'hello_world'],
      ['HELLO_WORLD', 'HELLO_WORLD', 'HELLO_WORLD', 'HELLO_WORLD'],
      ['helloWorld', 'helloWorld', 'hELLOWORLD', 'helloWorld'],
      ['HelloWorld', 'HelloWorld', 'HELLOWORLD', 'HelloWorld'],
      ['helloWorld', 'hello_world', 'HELLO_WORLD', 'HelloWorld'],
    ]);
  });
});
