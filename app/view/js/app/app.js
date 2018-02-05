import React from 'react';
import {mainHeader} from "./components/main/header/index";
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import {ABOUT_PATH, APP_HOME, TOPICS_PATH} from "./paths";

const hello       = num => ({match}) => <div>HELLO{['!', '@', '#'][num - 1].repeat(3)}</div>;
const application =
          <Router>
              <div className="application">
                  {mainHeader}
                  <div className="main main--content">
                      <Route exact path={APP_HOME} component={hello(1)} />
                      <Route path={ABOUT_PATH} component={hello(2)} />
                      <Route path={TOPICS_PATH} component={hello(3)} />
                  </div>
              </div>
          </Router>;

export default application;