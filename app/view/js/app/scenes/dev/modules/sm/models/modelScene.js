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
import {DevScene} from "../../../components/scene";
import {withRouter} from "react-router"
import ActiveModelScene from "./components/scene/active";
import {ActiveComponent} from "../../../components/selectivelyActive/components";
import {selectActiveModelSmIDs, selectAllModelMetaObjects, selectCreatingModelMetaSmIDs, selectModelDevInterface, selectModelSceneActivity} from "./selector";

@connect(mapState, mapDispatch)
class ModelScene extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this.props.fetchModels()
    }
    
    render() {
        const pathname = this.props.location.pathname;
        let isActive   = this.props.isActive;
        if (pathname.indexOf('models') > 0) isActive = true;
        return (
            <DevScene className={"model"}
                      isActive={isActive}
                      onActivate={this.props.toggleModelScene}
                      onDeactivate={this.props.toggleModelScene}
                      childClassName={"model--container"}
                      title={"Models"}>
                <ActiveComponent component={ActiveModelScene} {...this.props} />
            </DevScene>
        )
    }
}

export default withRouter(ModelScene);

function mapState(state) {
    const models                 = selectAllModelMetaObjects(state) || {};
    const isActive               = selectModelSceneActivity(state);
    const modelState             = selectModelDevInterface(state);
    const activeModelSmIDs       = selectActiveModelSmIDs(state) || [];
    const creatingModelMetaSmIDs = selectCreatingModelMetaSmIDs(state) || [];
    const allModelSmIDs          = modelState.list || [];
    return {
        models,
        isActive,
        allModelSmIDs,
        activeModelSmIDs,
        creatingModelMetaSmIDs
    };
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