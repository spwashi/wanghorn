import React from 'react'
import {render} from 'react-dom'
import {createStore,} from "redux";
import {Provider} from "react-redux";
import {devToolsEnhancer} from 'redux-devtools-extension';
import reducer from "./reducers";
import SchematicDepiction from "./modules/schematic-depiction/modules/SchematicDepiction/index";

const app_elem    = document.getElementById('app');
const store       = createStore(reducer, devToolsEnhancer());
const app         =
          <div className="application">
              <SchematicDepiction />
          </div>;
const appProvider =
          <Provider store={store}>
              {app}
          </Provider>;

render(appProvider, app_elem);