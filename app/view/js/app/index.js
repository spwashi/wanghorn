import React from "react";

import {BrowserRouter as Router} from 'react-router-dom';
import {browserHistory} from 'react-router'
import {links} from "./links";
import {routes} from "./routes";
import {Header} from "./components/header";
import Content from "./components/content";
import {anchorate} from 'anchorate';

const Application = () => {
    let inner =
            <div className="content--wrapper application--content--wrapper">
                <Header links={links} />
                <Content>{routes}</Content>
            </div>;
    return <Router onUpdate={() => anchorate()}
                   history={browserHistory}>{inner}</Router>;
};

export default Application;