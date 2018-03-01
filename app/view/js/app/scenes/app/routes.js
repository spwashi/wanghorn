import React from "react";
import {ABOUT, HOME, TOPICS} from "../../paths";
import {Route} from "react-router-dom";

import {AboutPage, HomePage, TopicsPage} from "./scenes";

export const routes = [
    <Route key='HomePageRoute' exact path={HOME.length ? HOME : '/'} component={HomePage} />,
    <Route key='AboutPageRoute' path={ABOUT} component={AboutPage} />,
    <Route key='TopicsPageRoute' path={TOPICS} component={TopicsPage} />,
];