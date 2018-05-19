import React, {Component} from "react";
import {bindActionCreators} from 'redux'
import {
    activateModel,
    closeModelCreateDialog,
    deactivateModel,
    executeModelQuery,
    fetchModels,
    openModelCreateDialog,
    toggleModelActivity,
    toggleModelPropertyActivity,
    toggleModelScene
} from "./actions";
import {connect} from "react-redux";
import {InactiveDevComponent} from "../../../components/scene";
import {Route, Switch} from "react-router"
import ActiveModelScene from "./components/scene/active";
import {selectAllModelMetaObjects, selectModelDevInterface, selectModelSceneActivity} from "./selector";
import {getURI} from "../../../../../../path/resolution";
import {LinkItem} from "../../../../../../components/navigation";

@connect(mapState, mapDispatch)
class ModelScene extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this.props.fetchModels()
    }
    
    render() {
        return (
            <div className={`scene--wrapper dev--scene--wrapper model--scene--wrapper`}>
                <Switch>
                    <Route path={getURI('dev--models')}
                           component={
                               props =>
                                   <div className={`scene dev--scene model--scene dev--component--wrapper`}>
                                       <ActiveModelScene {...this.props} />
                                   </div>
                           } />
                    <Route>
                        <LinkItem to={getURI('dev--models')} isButton={true}>
                            <InactiveDevComponent title={'Models'} className={'dev--scene inactive model--container'} />
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
    return bindActionCreators({
                                  toggleModelPropertyActivity,
                                  toggleModelScene,
                                  toggleModelActivity,
                                  activateModel,
                                  deactivateModel,
                                  fetchModels,
                                  openModelCreateDialog,
                                  closeModelCreateDialog,
                                  executeModelQuery
                              }, dispatch);
}