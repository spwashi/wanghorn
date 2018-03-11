import React from "react";
import {Route} from 'react-router-dom'
import {HOME, LINK_ONE, LINK_TWO} from "./paths";
import {HomePage, LinkOnePage, LinkTwoPage} from "../scenes";

export const routes = [
    <Route key='Home' exact path={HOME.length ? HOME : '/'} component={HomePage} />,
    <Route key='LinkOne' exact path={LINK_ONE} component={LinkOnePage} />,
    <Route key='LinkTwo' exact path={LINK_TWO} component={LinkTwoPage} />,
];