import React from 'react'
import {render} from 'react-dom'
import {createStore,} from "redux";
import {Provider} from "react-redux";
import {Link, Route} from 'react-router-dom'
import reducer from "./reducers";
import {Application} from "./components/application/index";

const store              = createStore(reducer);
const appProvider        =
          <Provider store={store}>
              <Application />
          </Provider>;
const appBinding_Element = document.getElementById('app');
//
render(appProvider, appBinding_Element);