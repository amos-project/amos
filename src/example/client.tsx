/*
 * @since 2020-11-03 13:25:08
 * @author acrazing <joking.young@gmail.com>
 */

import React from 'react';
import { render } from 'react-dom';
import { createStore } from '../store';
import { App } from './app';

declare const __INITIAL_STATE__: any;

const store = createStore(__INITIAL_STATE__);

render(<App store={store} />, document.querySelector('#root'));
