import React from 'react'
import {render,} from 'react-dom'
import {applyMiddleware, compose, createStore} from "redux";
import {PersistGate} from 'redux-persist/integration/react';
import {autoRehydrate, persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import promise from "redux-promise-middleware";
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import reducer from "./app/reducer";
import Application from "./app";
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const middleware       = [promise(), thunk];
const enhancers        = composeEnhancers(applyMiddleware(...middleware));
const persist_config   = {key: 'root', storage, stateReconciler: hardSet};
const persist_reducer  = persistReducer(persist_config, reducer);
const store            = createStore(persist_reducer, enhancers);
const persistor        = persistStore(store);
const provider         =
          <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                  <Application />
              </PersistGate>
          </Provider>;
render(provider, document.getElementById('app'));