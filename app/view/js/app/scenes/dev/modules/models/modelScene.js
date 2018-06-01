import React, {Component} from "react";
import {bindActionCreators} from 'redux'
import {connect} from "react-redux";
import {Route, Switch} from "react-router"

import {InactiveDevComponent} from "../../components/scene";
import ActiveModelScene from "./components/scene/active";
import {getURI} from "../../../../../path/resolution";
import {LinkItem} from "../../../../../components/navigation";

import {selectAllModelMetaObjects, selectModelDevInterface, selectModelSceneActivity} from "./selector";
import {executeModelQuery} from "../../../sm/modules/models/actions/index";

@connect(mapState, mapDispatch)
class ModelScene extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className={`scene--wrapper dev--scene--wrapper smEntity--scene--wrapper`}>
                <Switch>
                    <Route path={getURI('dev--models')}
                           component={
                               props =>
                                   <div className={`scene dev--scene smEntity--scene dev--component--wrapper`}>
                                       <ActiveModelScene {...this.props} />
                                   </div>
                           } />
                    <Route>
                        <LinkItem to={getURI('dev--models')} isButton={true}>
                            <InactiveDevComponent title={'Models'} className={'dev--scene inactive smEntity--container'} />
                        </LinkItem>
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default ModelScene;

function mapState(state) {
    const models        = selectAllModelMetaObjects(state) || {};
    const isActive      = selectModelSceneActivity(state);
    const modelState    = selectModelDevInterface(state);
    const allModelSmIDs = modelState.list || [];
    return {models, isActive, allModelSmIDs};
}
function mapDispatch(dispatch) {
    return bindActionCreators({executeModelQuery}, dispatch);
}