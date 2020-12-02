/*
 * @since 2020-11-28 10:32:52
 * @author acrazing <joking.young@gmail.com>
 */

import { JSONState } from '../core/types';
import { clone } from './immutable_utils';

export class AmosRecord {
  merge(props: Partial<this>): this {
    return clone(this, props);
  }

  fromJSON(state: JSONState<this>): this {
    return this.merge(this);
  }
}
