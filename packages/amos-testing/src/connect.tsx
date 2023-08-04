/*
 * @since 2021-01-19 23:37:53
 * @author acrazing <joking.young@gmail.com>
 */

import { ConnectedProps } from 'amos-react';
import React, { PureComponent } from 'react';
import { countBox } from './store/misc.boxes';

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
