import React from "react";
import {connect} from "react-redux";
import {Route} from "react-router";
import ModelModule from "./modules/sm/models/modelScene";
import {RoutesScene as RoutesModule} from "./modules/routes/routesScene";
import reducer from "./reducer"
import {selectDev} from "./selector";
import {PageContent} from "../../components/page";
import {DEV, HOME} from "../../../path/paths";
import {getURI} from "../../../path/resolution";
import {LinkItem} from "../../../components/navigation";

const Dev = ({models}) => {
    return (
        <PageContent pageTitle="Developer Interface" pageClass={`.page--__--dev`}>
            <section className="description page--description">
                <p>
                    This is a Developer's interface <sub>(work-in-progress)</sub> for the sites/apps that <a href={HOME} title={'William'}>I</a> help build.
                </p>
                <p>
                    You can use your keyboard to navigate this page, but the only component that's animated now is the Route component
                    because the <LinkItem to={getURI('dev--models')} wrapper={props => <span {...props} />}>Model</LinkItem> component was refactored recently to be URL-friendly.
                </p>
                <ul>
                    <li><span className="keypress--name">Tab</span> to advance</li>
                    <li><span className="keypress--name">Space or Enter</span> to toggle activation.</li>
                </ul>
                <p>
                    The <LinkItem to={getURI('dev--models')} wrapper={props => <span {...props} />}>Model</LinkItem> component describes the structures
                    used by this application to <em>store</em> data, and the <LinkItem to={getURI('dev--entities')} wrapper={props => <span {...props} />}>Entities</LinkItem>
                    &nbsp; component (todo) describes the structures used by this application to <em>interact with or manipulate</em> data.
                </p>
            </section>
            <Route path={DEV} component={ModelModule} />
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