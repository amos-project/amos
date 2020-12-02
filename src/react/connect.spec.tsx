/*
 * @since 2020-11-04 12:38:35
 * @author acrazing <joking.young@gmail.com>
 */

import React, { PureComponent } from 'react';
import { countBox } from '../core/box.spec';
import { selectMultipleCount } from '../core/selector.spec';
import { connect, ConnectedProps } from './connect';

export interface TestClassProps extends ConnectedProps {
  id: number;
  count: number;
}

export class TestClass extends PureComponent<TestClassProps> {
  static nextId() {
    return Date.now();
  }

  current() {
    return TestClass.nextId();
  }

  private handleClick = async () => {
    await this.props.dispatch(countBox.setState(TestClass.nextId()));
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
    const TC2 = connect((select) => ({
      count: select(countBox),
    }))(TestClass);
    const TC3 = connect((select, ownedProps: { multiply: number }) => ({
      count: select(selectMultipleCount(ownedProps.multiply)),
    }))(TestClass);
    expect(<TC1 id={1} count={1} ref={(instance) => instance?.current()} />).toBeDefined();
    expect(<TC2 id={2} />).toBeDefined();
    expect(<TC3 multiply={3} id={3} />).toBeDefined();
  });
});
