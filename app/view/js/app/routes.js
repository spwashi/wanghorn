import React from "react";
import {Route} from 'react-router-dom'
import {ABOUT_ME, DEV, HOME} from "../paths";
import {Dev, Home, LinkOne} from "./scenes";

// remember to add the appropriate link in ./links
export const routes = [
    <Route exact key='Home' path={HOME.length ? HOME : '/'} component={Home} />,
    <Route exact key='LinkOne' path={ABOUT_ME} component={LinkOne} />,
    <Route exact key='Dev' path={DEV} component={Dev} />,
];