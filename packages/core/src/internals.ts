/*
 * @since 2022-01-10 17:09:37
 * @author junbao <junbao@moego.pet>
 */

import { Mutation } from 'amos-core';

/** @internal */
export function applyMutation<S>(state: S, mutation: Mutation<any[], S>): S {
  return mutation.mutator.apply(mutation.box, [state, ...mutation.args]);
}
