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
import {selectActiveModelMetas, selectActiveModelSmIDs, selectCreatingModelMetaSmIDs, selectModelDevInterface, selectModelSceneActivity} from "./selector";
import {DevScene} from "../../../components/scene";
import {connect} from "react-redux";
import {ActiveComponent} from "../../../components/selectivelyActive/components";
import {ActiveModelScene} from "./components/scene/active";

@connect(mapState, mapDispatch)
export default class ModelScene extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this.props.fetchModels()
    }
    
    render() {
        return (
            <DevScene className={"model"}
                      isActive={this.props.isActive}
                      onActivate={this.props.toggleModelScene}
                      onDeactivate={this.props.toggleModelScene}
                      childClassName={"model--container"}
                      title={"Models"}>
                <ActiveComponent component={ActiveModelScene} {...this.props} />
            </DevScene>
        )
    }
}

function mapState(state) {
    const modelState             = selectModelDevInterface(state);
    const models                 = selectActiveModelMetas(state) || {};
    const isActive               = selectModelSceneActivity(state);
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