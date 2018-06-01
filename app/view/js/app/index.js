import React from "react";

import {BrowserRouter as Router} from 'react-router-dom';
import {browserHistory} from 'react-router'
import {links} from "./configuration/links";
import routes from "./configuration/routes";
import {Header} from "./components/header";
import {anchorate} from 'anchorate';

import './configuration/sm/modify/fields';
import {SmScene} from "./scenes/sm";

class Application extends React.Component {
    state = {};
    
    render() {
        return (
            <Router onUpdate={() => anchorate()} history={browserHistory}>
                <div id={"app--wrapper"} className={`content--wrapper application--content--wrapper`}>
                    <Header links={links} />
                    <main className="main main--content">{routes}</main>
                    <SmScene />
                </div>
            </Router>
        );
    }
}

export default Application;