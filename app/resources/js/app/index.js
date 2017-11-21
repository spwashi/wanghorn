import React from 'react'
import {render} from 'react-dom'
import {createStore,} from "redux";
import {Provider} from "react-redux";

import reducer from "./rootReducer";
import {createSchema} from "./modules/schematic-depiction/actions"
import {ActiveSchemaContainer} from "./modules/schematic-depiction/components/Schema/components/schemaContainer";

const app_elem = document.getElementById('app');
const store    = createStore(reducer);
const app      =
          <div className="application">
              <ActiveSchemaContainer onCreateSchemaContainer={createSchema} />
          </div>;

let appProvider =
        <Provider store={store}>
            {app}
        </Provider>;

render(appProvider, app_elem);