import React from "react";
import {BrowserRouter as Router} from 'react-router-dom'

import {MainHeader} from "./main/header";
import {MainContent} from "./main/content";

const SimpleApp = ({links, routes}) => {
    return (
        <Router>
            <div className="app">
                <MainHeader links={links} />
                <MainContent routes={routes} />
            </div>
        </Router>);
};

export default SimpleApp;