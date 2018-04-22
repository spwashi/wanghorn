import React from "react";

import {BrowserRouter as Router} from 'react-router-dom';
import {browserHistory} from 'react-router'
import {links} from "./links";
import {routes} from "./routes";
import {Header} from "./components/header";
import Content from "./components/content";
import {anchorate} from 'anchorate';
import ReactModal from 'react-modal';

class Application extends React.Component {
    componentDidMount() {
        ReactModal.setAppElement('#app--wrapper');
    }
    
    render() {
        return (
            <Router onUpdate={() => anchorate()} history={browserHistory}>
                <div id={"app--wrapper"} className="content--wrapper application--content--wrapper">
                    <Header links={links} />
                    <Content>{routes}</Content>
                </div>
            </Router>
        );
    }
}

export default Application;