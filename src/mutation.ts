/*
 * @since 2020-11-05 15:24:05
 * @author acrazing <joking.young@gmail.com>
 */

import { Box } from './box';

export interface Mutation<S, A> {
  object: 'mutation';
  type: string | undefined;
  box: Box<S>;
  action: A;
  mutator: (state: S, action: A) => S;
}

export interface MutationFactory<S, A> {
  (action: A): Mutation<S, A>;
}

export function mutation<S, A>(
  box: Box<S>,
  mutator: (state: S, action: A) => S,
  type?: string,
): MutationFactory<S, A> {
  return (action) => ({ object: 'mutation', type, box, action, mutator });
}
