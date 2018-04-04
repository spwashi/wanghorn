import React from 'react'
import {render} from 'react-dom'
import {applyMiddleware, compose, createStore} from "redux";
import promise from "redux-promise-middleware";
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import reducer from "./app/reducer";
import Application from "./app";


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware       = [promise(), thunk];
const store            = createStore(reducer,
                                     composeEnhancers(applyMiddleware(...middleware)));
const provider         =
          <Provider store={store}>
              <Application />
          </Provider>;
render(provider, document.getElementById('app'));