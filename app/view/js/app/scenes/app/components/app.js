import React from "react";
import {BrowserRouter as Router} from 'react-router-dom'

import {MainHeader} from "../../../components/main/header/index";
import {MainContent} from "../../../components/main/content/index";

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