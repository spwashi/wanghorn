import React from "react";
import {Route} from 'react-router-dom'
import {DEV, HOME, LINK_ONE, LINK_TWO} from "../paths";
import {Dev, Home, LinkTwo} from "./scenes";
import LinkOne from "./scenes/link-one";

// remember to add the appropriate link in ./links
export const routes = [
    <Route exact key='Home' path={HOME.length ? HOME : '/'} component={Home} />,
    <Route exact key='LinkOne' path={LINK_ONE} component={LinkOne} />,
    <Route exact key='LinkTwo' path={LINK_TWO} component={LinkTwo} />,
    <Route exact key='Dev' path={DEV} component={Dev} />,
];