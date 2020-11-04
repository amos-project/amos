/*
 * @since 2020-11-04 12:38:35
 * @author acrazing <joking.young@gmail.com>
 */

import React, { PureComponent } from 'react';
import { addGreet } from './action.spec';
import { TestBox } from './box.spec';
import { connect, ConnectedProps } from './connect';

export interface TestClassProps extends ConnectedProps {
  id: number;
  count: number;
}

export class TestClass extends PureComponent<TestClassProps> {
  static nextId() {
    return new Date().toISOString();
  }

  current() {
    return TestClass.nextId();
  }

  private handleClick = async () => {
    await this.props.dispatch(addGreet('Hello connected class ' + TestClass.nextId()));
  };

  render() {
    return (
      <div id="test-class" onClick={this.handleClick}>
        {this.props.count}
      </div>
    );
  }
}

describe('connect', () => {
  it('should not emit types error', () => {
    const TC1 = connect()(TestClass);
    const TC2 = connect((store) => ({
      count: store.pick(TestBox).count,
    }))(TestClass);
    const TC3 = connect((store, ownedProps: { id: number }) => ({
      count: store.pick(TestBox).count,
    }))(TestClass);
    const TC4 = connect(TestBox, (store, test, ownedProps: { now: number }) => ({
      count: test.count,
    }))(TestClass);
    expect(TC1.nextId).toBeDefined();
    expect(<TC1 id={1} count={1} ref={(instance) => instance?.current()} />).toBeDefined();
    expect(<TC2 id={2} />).toBeDefined();
    expect(<TC3 id={3} />).toBeDefined();
    expect(<TC4 id={4} now={Date.now()} />).toBeDefined();
  });
});
