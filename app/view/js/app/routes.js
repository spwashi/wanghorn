import React from "react";
import {Route} from 'react-router-dom'
import {ABOUT_ME, DEV, HOME, GALLERY} from "../paths";
import {AboutMe, Dev, Home, Gallery} from "./scenes";

// remember to add the appropriate link in ./links
export const routes = [
    <Route exact key='Home' path={HOME.length ? HOME : '/'} component={Home} />,
    <Route exact key='LinkOne' path={ABOUT_ME} component={AboutMe} />,
    <Route exact key='Gallery' path={GALLERY} component={Gallery} />,
    <Route exact key='Dev' path={DEV} component={Dev} />,
];