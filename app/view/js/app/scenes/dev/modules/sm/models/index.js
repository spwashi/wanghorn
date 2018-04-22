import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux'
import bind from "bind-decorator";
import {ActiveComponent, InactiveComponent, SelectivelyActive} from "../../../components/selectivelyActive";
import ModelDevComponent from "./model";
import ModelLinkContainer from "./components/nav";
import {activateModel, deactivateModel, executeModelQuery, fetchModels, toggleModelActivity, toggleModelPropertyActivity} from "./actions";
import {selectActiveModelMetas, selectActiveModelSmIDs, selectModelDevInterface} from "./selector";

@connect(mapState, mapDispatch)
class ModelScene extends Component {
    constructor(props) {super(props);}
    
    componentDidMount() {this.props.fetchModels();}
    
    @bind
    handleModelLinkTrigger(event) {
        const smID = event.target.dataset.sm_id;
        event.preventDefault();
        this.props.toggleModelActivity({smID});
    }
    
    static matchActivationTarget(target) {
        return (
            target.classList.contains("model--metas") ||
            target.classList.contains("model--meta--wrapper") ||
            target.classList.contains("model--container--title") ||
            target.classList.contains("model--container")
        );
    };
    
    render() {
        const models                                   = this.props.models;
        const {allModelSmIDs: smIDs, activeModelSmIDs} = this.props;
        return (
            <SelectivelyActive matchTarget={ModelScene.matchActivationTarget} className={"model--metas"} isActive={true}>
                <ActiveComponent>{this.ActiveComponent}</ActiveComponent>
                <InactiveComponent>{this.InactiveComponent}</InactiveComponent>
            </SelectivelyActive>
        );
    }
    
    @bind
    InactiveComponent() {
        return <div className={"model--container collapsed"}>Models</div>;
    }
    
    @bind
    ActiveComponent(props) {
        let modelEntry__devComponent =
                ([smID, modelState]) =>
                    <ModelDevComponent key={smID}
                                       {...{...modelState, smID}}
                                       onTogglePropertyClick={
                                           propertySmID => {
                                               return this.props.toggleModelPropertyActivity({smID: propertySmID});
                                           }}
                                       executeModelQuery={this.props.executeModelQuery} />;
        return (
            <div className={"model--container"}>
                <h2 className={"model--container--title"}>Models</h2>
                <ModelLinkContainer onItemTrigger={this.handleModelLinkTrigger} activeSmIDs={this.props.activeModelSmIDs} allSmIDs={this.props.allModelSmIDs} />
                {Object.entries(this.props.models).map(modelEntry__devComponent)}
            </div>
        );
    }
}

export default ModelScene;
function mapState(state) {
    const modelState       = selectModelDevInterface(state);
    const models           = selectActiveModelMetas(state) || {};
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
                                  toggleModelPropertyActivity,
                                  toggleModelActivity,
                                  activateModel,
                                  deactivateModel,
                                  fetchModels,
                                  executeModelQuery
                              }, dispatch);
}