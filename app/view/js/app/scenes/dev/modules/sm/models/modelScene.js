import React, {Component} from "react";
import {bindActionCreators} from 'redux'
import {activateModel, closeModelCreateDialog, deactivateModel, executeModelQuery, fetchModels, openModelCreateDialog, toggleModelActivity, toggleModelPropertyActivity} from "./actions";
import {selectActiveModelMetas, selectActiveModelSmIDs, selectCreatingModelMetaSmIDs, selectModelDevInterface} from "./selector";
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
    const activeModelSmIDs       = selectActiveModelSmIDs(state) || [];
    const creatingModelMetaSmIDs = selectCreatingModelMetaSmIDs(state) || [];
    const allModelSmIDs          = modelState.list || [];
    return {
        models,
        allModelSmIDs,
        activeModelSmIDs,
        creatingModelMetaSmIDs
    };
}
function mapDispatch(dispatch) {
    return bindActionCreators({
                                  toggleModelPropertyActivity,
                                  toggleModelActivity,
                                  activateModel,
                                  deactivateModel,
                                  fetchModels,
                                  openModelCreateDialog,
                                  closeModelCreateDialog,
                                  executeModelQuery
                              }, dispatch);
}