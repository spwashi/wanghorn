import React from "react";
import {BrowserRouter as Router} from 'react-router-dom';

import {links} from "../../links";
import {routes} from "../../routes";

import {Header} from "./header";
import {Content} from "./content";

export const Application = () => {
    let inner =
            <div className="app">
                <Header links={links} />
                <Content routes={routes} />
            </div>;
    return <Router>{inner}</Router>;
};

export default Application;