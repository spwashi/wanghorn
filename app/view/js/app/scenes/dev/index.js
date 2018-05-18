import React from "react";
import {connect} from "react-redux";
import {Route} from "react-router";
import ModelModule from "./modules/sm/models/modelScene";
import {RoutesScene as RoutesModule} from "./modules/routes/routesScene";
import reducer from "./reducer"
import {selectDev} from "./selector";
import {PageContent} from "../../components/page";
import {HOME} from "../../../path/paths";

const Dev = ({models}) => {
    return (
        <PageContent pageTitle="Developer Interface" pageClass={`.page--__--dev`}>
            <section className="description page--description">
                <p>
                    This is a Developer's interface <sub>(work-in-progress)</sub> for the sites/apps that <a href={HOME} title={'William'}>I</a> help build.
                </p>
                <p>
                    You can use your keyboard to navigate this page:
                </p>
                <ul>
                    <li><span className="keypress--name">Tab</span> to advance</li>
                    <li><span className="keypress--name">Space or Enter</span> to activate/deactivate</li>
                </ul>
            </section>
            <Route component={ModelModule} />
            <Route component={RoutesModule} />
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