/*
 * @since 2020-11-04 12:38:35
 * @author acrazing <joking.young@gmail.com>
 */

import { countBox, selectMultipleCount, TestClass } from 'amos-testing';
import React from 'react';
import { connect } from './connect';

describe('connect', () => {
  it('should not emit types error', () => {
    const TC1 = connect()(TestClass);
    const TC2 = connect((select) => ({
      count: select(countBox),
    }))(TestClass);
    const TC3 = connect((select, ownedProps: { multiply: number }) => ({
      count: select(selectMultipleCount(ownedProps.multiply)),
    }))(TestClass);
    expect(<TC1 id={1} count={1} ref={(instance) => instance?.current()} />).toBeDefined();
    expect(<TC2 id={2} />).toBeDefined();
    expect(<TC3 multiply={3} id={3} />).toBeDefined();
    // @ts-expect-error
    expect(<TC3 id={3} />).toBeDefined();
  });
});
