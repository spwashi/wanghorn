import {Route} from 'react-router-dom'
import React from "react"
import Application from "./components/app";

import {ABOUT_PATH, APP_HOME, TOPICS_PATH} from "../../paths";
import {LinkItem} from "../../../components/navigation";

import {AboutPage, HomePage, TopicsPage} from "./scenes";

const navLinks = [
    <LinkItem key='HomePageLink' to={APP_HOME} as="Home" />,
    <LinkItem key='AboutPageLink' to={ABOUT_PATH} as="About" />,
    <LinkItem key='TopicsPageLink' to={TOPICS_PATH} as="Topics" />,
];
const routes   = [
    <Route key='HomePageRoute' exact path={APP_HOME} component={HomePage} />,
    <Route key='AboutPageRoute' path={ABOUT_PATH} component={AboutPage} />,
    <Route key='TopicsPageRoute' path={TOPICS_PATH} component={TopicsPage} />,
];

export const MainApplication = () => <Application links={navLinks} routes={routes} />;