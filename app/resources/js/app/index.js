import React from 'react'
import {render} from 'react-dom'
import {createStore,} from "redux";
import {Provider} from "react-redux";
import {devToolsEnhancer} from 'redux-devtools-extension';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import application from './modules/application'
import reducer from "./reducers";

const store              = createStore(reducer, devToolsEnhancer());
const appProvider        = <Provider store={store}>{application}</Provider>;
const appBinding_Element = document.getElementById('app');

render(appProvider, appBinding_Element);