import React from 'react'
import {render as reactRender,} from 'react-dom'
import {applyMiddleware, compose, createStore} from "redux";
import promise from "redux-promise-middleware";
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import reducer from "./app/reducer";
import Application from "./app";
import {AppContainer, hot} from 'react-hot-loader';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware       = [promise(), thunk];
const store            = createStore(reducer,
                                     composeEnhancers(applyMiddleware(...middleware)));
const render           = Component => {
    const provider    =
              <Provider store={store}>
                  <Component />
              </Provider>;
    const providerHot = hot(module)(provider);
    reactRender(
        <AppContainer>
            {providerHot}
        </AppContainer>
        ,
        document.getElementById('app')
    );
};
render(Application);
if (module.hot) {
    console.log('hwhwehwehw');
    module.hot.accept('./app', () => { render(Application) })
} else {
    console.log(module.hot);
    
}