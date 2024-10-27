/*
 * @since 2024-10-25 11:25:04
 * @author junbao <junbao@moego.pet>
 */

import {
  addFourfoldAsync,
  countBox,
  expectCalled,
  expectCalledWith,
  loginAsync,
  LOGOUT,
  type LogoutEvent,
  sessionIdBox,
} from 'amos-testing';
import { createStore } from '../store';
import type { ReduxDevtoolsExtension } from './withDevtools';

describe('withDevtools', () => {
  it('should send event', async () => {
    const init = jest.fn();
    const send = jest.fn();
    const extension: ReduxDevtoolsExtension = {
      connect: () => ({ init, send }),
    };
    const e: LogoutEvent = { userId: 2, sessionId: 2 };
    const store = createStore({ devtools: { enable: true, extension } });
    const tasks = [addFourfoldAsync(2), loginAsync(1), LOGOUT(e), countBox.setState(1)] as const;
    const r = await Promise.all(store.dispatch(tasks));
    expect([...r, store.select(countBox)]).toEqual([8, store.select(sessionIdBox), e, 1, 5]);
    expectCalledWith(init, [{}]);
    const calls = Object.fromEntries(
      send.mock.calls.map((c, i, array) => [
        i.toString().padStart(array.length.toString().length, '0') + ':' + c[0].type,
        {
          ...c[0],
          root: c[0].root && 'ROOT',
          state: c[1],
        },
      ]),
    );
    expect(calls).toMatchSnapshot('devtools events');
    expectCalled(send, 21);
  });
});
