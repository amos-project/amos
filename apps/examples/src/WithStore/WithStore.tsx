import React, { FC, PropsWithChildren } from 'react';
import { createStore } from 'amos';
import { Provider } from 'amos-react';

const store = createStore();

export const WithStore: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
