/*
 * @since 2024-10-18 23:40:53
 * @author junbao <junbao@moego.pet>
 */

import { selector } from 'amos';
import { currentUserIdBox, userMapBox } from './user.boxes';

export const selectCurrentUser = selector((select) => {
  return select(userMapBox.getItem(select(currentUserIdBox)));
});
