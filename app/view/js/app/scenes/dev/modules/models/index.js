import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux'
import bind from "bind-decorator";
import {SelectivelyActive} from "../../components";
import ModelDevComponent from "./model";
import {activateModel, deactivateModel, executeModelQuery, fetchModels, toggleModelActivity} from "./actions";
import {selectActiveDevModels, selectActiveModelSmIDs, selectModelDevInterface} from "./selector";
import ModelLinkContainer from "./components/nav";
import {ActiveComponent, InactiveComponent} from "../../components/selectivelyActive";

@connect(mapState, mapDispatch)
class ModelScene extends Component {
    constructor(props) {super(props);}
    
    componentDidMount() {this.props.fetchModels();}
    
    @bind
    handleModelLinkClick(event) {
        const smID = event.target.dataset.sm_id;
        event.preventDefault();
        this.props.toggleModelActivity({smID});
    }
    
    static matchActivationTarget(target) {
        return (
            target.classList.contains("dev--models") ||
            target.classList.contains("dev--model--wrapper") ||
            target.classList.contains("model--container--title") ||
            target.classList.contains("model--container")
        );
    };
    
    render() {
        const models                                   = this.props.models;
        const {allModelSmIDs: smIDs, activeModelSmIDs} = this.props;
        return (
            <SelectivelyActive matchTarget={ModelScene.matchActivationTarget} className={"dev--models"} isActive={true}>
                <ActiveComponent>{this.ActiveComponent}</ActiveComponent>
                <InactiveComponent>{this.InactiveComponent}</InactiveComponent>
            </SelectivelyActive>
        );
    }
    
    @bind
    InactiveComponent() {
        return <div className={"model--container collapsed"}>!!!Models</div>;
    }
    
    @bind
    ActiveComponent(props) {
        let modelEntry__devComponent =
                ([smID, modelData]) =>
                    <ModelDevComponent key={smID} smID={smID} {...modelData} executeModelQuery={this.props.executeModelQuery} />;
        return (
            <div className={"model--container"}>
                <h2 className={"model--container--title"}>Models</h2>
                <ModelLinkContainer onItemClick={this.handleModelLinkClick} activeSmIDs={this.props.activeModelSmIDs} allSmIDs={this.props.allModelSmIDs} />
                {Object.entries(this.props.models).map(modelEntry__devComponent)}
            </div>
        );
    }
}

export default ModelScene;
function mapState(state) {
    const modelState       = selectModelDevInterface(state);
    const models           = selectActiveDevModels(state) || {};
    const activeModelSmIDs = selectActiveModelSmIDs(state) || [];
    const allModelSmIDs    = modelState.list || [];
    return {
        models,
        allModelSmIDs,
        activeModelSmIDs
    };
}
function mapDispatch(dispatch) {
    return bindActionCreators({
                                  toggleModelActivity,
                                  activateModel,
                                  deactivateModel,
                                  fetchModels,
                                  executeModelQuery
                              }, dispatch);
}