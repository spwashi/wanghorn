import React from "react";
import {connect} from "react-redux";
import ModelModule from "./modules/sm/models/modelScene";
import {RoutesScene as RoutesModule} from "./modules/routes/routesScene";
import reducer from "./reducer"
import {selectDev} from "./selector";
import {PageContent} from "../../components/page";
import {HOME} from "../../../paths";

const Dev = ({models}) => {
    return (
        <PageContent pageTitle="Developer Interface" pageClass={`.page--__--dev`}>
            <section className="description page--description">
                <p>
                    This is a <dt>Developer's interface</dt><sub>(work-in-progress)</sub> for the sites/apps that <a href={HOME} title={'William'}>I (william)</a> help build.
                </p>
            </section>
            <ModelModule />
            <RoutesModule></RoutesModule>
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