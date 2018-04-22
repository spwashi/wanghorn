import React from "react";
import {connect} from "react-redux";
import ModelModule from "./modules/sm/models";
import reducer from "./reducer"
import {selectDev} from "./selector";
import {PageContent} from "../../components/page";
import {HOME} from "../../../paths";
import {MODELS} from "./paths";

const Dev = ({models}) => {
    return (
        <PageContent pageTitle="Developer Interface" pageClass={`.page--__--dev`}>
            <section className="content--section description page--description">
                <p>
                    This is a <dt>Developer's interface</dt><sub>(work-in-progress)</sub> for the sites/apps that <a href={HOME} title={'William'}>I (william)</a> help build.
                </p>
                
                <p>Right now, all it does is help Sam check to see if <a href={`${MODELS}?models`}>the data structures in use by each site/app</a> are
                   properly understood by each of the two libraries created by <a href="https://spwashi.com">Sam Washington (the person who made me)</a>:
                </p>
                <ol title={"What This Developer's Interface Does"}>
                    <li>
                        <em>The <a href="https://github.com/spwashi/SmJS" title={"The Configuration Library this app uses mainly"}>configuration library</a></em> that helps me get set up <sub>(written in ECMAScript 2015+)</sub>
                    </li>
                    <li>and <em>the <a href="https://github.com/spwashi/SmPHP" title={"The PHP Framework this app is built on"}>PHP 7.1 framework </a></em>
                        that drives my data storage and mutation
                    </li>
                </ol>
                <p>
                    It also describes the <a href={"https://dev.mysql.com/doc/refman/5.7/en/create-table.html"}>CREATE TABLE</a> and <a href={"https://dev.mysql.com/doc/refman/5.7/en/alter-table.html"}>ALTER TABLE</a> statements that could be used to connect the data structures to a MySQL database.
                </p>
            </section>
            <ModelModule />
        </PageContent>
    );
};

export default connect(
    state => {
        let {models} = selectDev(state);
        return {models};
    }
)(Dev);
export {reducer}