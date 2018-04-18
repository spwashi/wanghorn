import React from "react";
import {connect} from "react-redux";
import ModelModule from "./modules/models";
import reducer from "./reducer"
import {selectDev} from "./selector";
import {PageContent} from "../../components/page";
import {HOME} from "../../../paths";
import {MODELS} from "./paths";

const Dev = ({models}) => {
    return (
        <PageContent pageTitle="Developer Interface" pageClass={`.page--__--dev`}>
            <div className="description page--description">
                <p>
                    This is a <dt>Developer's interface</dt><sub>(work-in-progress)</sub> for the sites/apps that <a href={HOME} title={'William'}>I</a> help build.
                </p>
                
                <p>Right now, all it does is help Sam check to see if <a href={`${MODELS}?models`}>the data structures in use by each site/app</a> are
                   properly understood by two libraries made by <a href="https://spwashi.com">Sam Washington</a>
                </p>
                <ol>
                    <li>the <a href="https://github.com/spwashi/SmJS">configuration library</a> that helps me get set up <sub>(written in ECMAScript 2015+)</sub></li>
                    <li>and the <a href="https://github.com/spwashi/wanghorn">PHP 7.1 application </a>
                        that drives data storage and mutation
                        <sub>
                            (written using a <a href="https://github.com/spwashi/SmPHP"> PHP 7.1 framework</a>).
                        </sub>
                    </li>
                </ol>
                <p>
                    It also describes the CREATE TABLE and ALTER TABLE statements that could be used to begin using the data structures
                </p>
            </div>
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