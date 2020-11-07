/*
 * @since 2020-11-05 15:24:05
 * @author acrazing <joking.young@gmail.com>
 */

import { Box } from './box';

/**
 * A `Mutation` is a dispatchable object, which will update the
 * target box's state **synchronously** when you dispatch it.
 * The only way to create a `Mutation` is call the `MutationFactory`
 * which is created by calling `mutation()` method. You don't need
 * to pay attention to any properties of the `Mutation`.
 *
 * The return value of dispatch it is the action.
 *
 * @stable
 */
export interface Mutation<S, A extends any[]> {
  object: 'mutation';
  type: string | undefined;
  box: Box<S>;
  action: A;
  mutator: (state: S, ...action: A) => S;
}

/**
 * A `MutationFactory` is a function to create a `Mutation`, which
 * is created by `mutation()`. You do not need to pay attention to
 * any properties of the `MutationFactory`.
 *
 * @stable
 */
export interface MutationFactory<S, A extends [action?: any]> {
  object: 'mutation_factory';
  type: string | undefined;
  box: Box<S>;
  mutator: (state: S, ...action: A) => S;
  (...action: A): Mutation<S, A>;
}

/**
 * Create a `MutationFactory`.
 *
 * @param box the target box of the `mutator`
 * @param mutator the callback function to update the state of the
 *        `box`. Please note it should returns a new object as the
 *        new state as if the state need to be mutated.
 * @param type an optional string to indicates the type of the
 *        mutation.
 *
 * @stable
 */
export function mutation<S, A extends [action?: any]>(
  box: Box<S>,
  mutator: (state: S, ...action: A) => S,
  type?: string,
): MutationFactory<S, A> {
  return Object.assign(
    (action?: any) =>
      ({
        object: 'mutation',
        type,
        box,
        action,
        mutator,
      } as Mutation<S, A>),
    { object: 'mutation_factory', type, box, mutator } as const,
  );
}
