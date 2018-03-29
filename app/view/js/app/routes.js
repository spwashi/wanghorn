import React from "react";
import {Route} from 'react-router-dom'
import {HOME, LINK_ONE, LINK_TWO} from "./paths";
import {Home, LinkOne, LinkTwo} from "./scenes";

export const routes = [
    <Route exact key='Home' path={HOME.length ? HOME : '/'} component={Home} />,
    <Route exact key='LinkOne' path={LINK_ONE} component={LinkOne} />,
    <Route exact key='LinkTwo' path={LINK_TWO} component={LinkTwo} />,
];