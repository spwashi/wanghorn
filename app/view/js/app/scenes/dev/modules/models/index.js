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
export default class ModelScene extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {this.props.fetchModels();}
    
    @bind
    handleModelLinkClick(event) {
        const smID = event.target.dataset.sm_id;
        event.preventDefault();
        this.props.toggleModelActivity({smID});
    }
    
    /**
     * Given the response from the /dev/models API call, format each individual Model
     * @param data
     * @return {Array<ModelDevComponent>}
     */
    createModels(data) {
        return Object.entries(data)
                     .map(queryEntry => {
                         const [key, modelData] = queryEntry;
                         return <ModelDevComponent key={key}
                                                   smID={key}
                                                   {...modelData}
                                                   executeModelQuery={this.props.executeModelQuery} />
                     });
    }
    
    render() {
        let Active                = () => {
            const models = this.props.models;
            console.log(Object.entries(models).length);
            const {allModelSmIDs: smIDs, activeModelSmIDs} = this.props;
            return (
                <div className={"model--container"}>
                    <h2 className={"model--container--title"}>Models</h2>
                    <ModelLinkContainer onItemClick={this.handleModelLinkClick} activeSmIDs={activeModelSmIDs} allSmIDs={smIDs} />
                    
                    {
                        (!models || !Object.entries(models).length) ? 'loading'
                                                                    : this.createModels(models)
                    }
                </div>
            );
        };
        let matchActivationTarget =
                target =>
                    (
                        target.classList.contains("dev--models") ||
                        target.classList.contains("dev--model--wrapper") ||
                        target.classList.contains("model--container--title") ||
                        target.classList.contains("model--container")
                    );
        return (
            <SelectivelyActive trigger={"click"} matchTarget={matchActivationTarget} className={"dev--models"} isActive={true}>
                <ActiveComponent>
                    <Active />
                </ActiveComponent>
                <InactiveComponent>
                    <div className={"model--container collapsed"}>Models</div>
                </InactiveComponent>
            </SelectivelyActive>
        );
    }
}

function mapState(state) {
    let modelState = selectModelDevInterface(state);
    const models   = selectActiveDevModels(state) || {};
    console.log(models);
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