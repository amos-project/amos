/*
 * @since 2020-11-03 13:42:04
 * @author acrazing <joking.young@gmail.com>
 */

import { Store } from '@kcats/core';
import { createContext } from 'react';

/** @internal */
export const __Context = createContext<Store | null>(null);

export const Provider = __Context.Provider;
export const Consumer = __Context.Consumer;
