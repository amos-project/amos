/*
 * @since 2024-10-18 23:40:53
 * @author junbao <junbao@moego.pet>
 */

// fake http
import { action } from 'amos';
import { hashCode } from './todo.boxes';
import { currentUserIdBox, signInSignal, signOutSignal, userMapBox, UserModel } from './user.boxes';

export async function doAsync<T>(value: T) {
  return value;
}

export const signIn = action(async (dispatch, select, name: string) => {
  const user = await doAsync<UserModel>({
    id: hashCode(name),
    name: name,
  });
  dispatch([userMapBox.mergeItem(user), currentUserIdBox.setState(user.id)]);
  dispatch(signInSignal(user));
});

export const signOut = action(async (dispatch, select, keepData: boolean) => {
  // do real sign out
  await doAsync(void 0);
  const userId = select(currentUserIdBox);
  dispatch(currentUserIdBox.setState());
  // notify boxes to clean data
  dispatch(signOutSignal({ userId, keepData }));
});
