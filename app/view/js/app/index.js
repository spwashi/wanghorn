import React from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import {links} from "./links";
import {routes} from "./routes";
import {Header} from "./components/header";
import Content from "./components/content";

const Application = () => {
    let inner =
            <div className="application--content--wrapper">
                <Header links={links} />
                <Content>{routes}</Content>
            </div>;
    return <Router>{inner}</Router>;
};

export default Application;