import React from 'react';
import {mainHeader} from "./components/main/header/index";
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import {ABOUT_PATH, APP_HOME, TOPICS_PATH} from "./paths";

const Page = ({pageTitle, pageClass, children}) => {
    return (
        <div className={"page " + pageClass}>
            <h1>{pageTitle}</h1>
            {children}
        </div>
    )
};

const AboutPage = () => <Page pageTitle="About" pageClass="page--__--about" />;
const Topics    = () => <Page pageTitle="Topics" pageClass="page--__--topics" />;
const Home      = () => <Page pageTitle="Home" pageClass="page--__--home" />;

const application =
          <Router>
              <div className="application">
                  {mainHeader}
                  <div className="main main--content">
                      <Route exact path={APP_HOME} component={AboutPage} />
                      <Route path={ABOUT_PATH} component={Topics} />
                      <Route path={TOPICS_PATH} component={Home} />
                  </div>
              </div>
          </Router>;

export default application;