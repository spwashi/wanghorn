import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux'
import bind from "bind-decorator";
import {SelectivelyActive} from "../../components";
import ModelDevComponent from "./model";
import {activateModel, deactivateModel, executeModelQuery, fetchModels, toggleModelActivity} from "./actions";
import {selectActiveDevModels, selectActiveModelSmIDs, selectModelDevInterface} from "./selector";
import ModelLinkContainer from "./components/nav";

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
            if (!models) return 'loading';
            const Models           = this.createModels(models);
            const activeModelSmIDs = this.props.activeModelSmIDs;
            const smIDs            = this.props.allModelSmIDs;
            return (
                <div className={"model--container"}>
                    <h2 className={"model--container--title"}>Models</h2>
                    <ModelLinkContainer onItemClick={this.handleModelLinkClick}
                                        activeSmIDs={activeModelSmIDs}
                                        allSmIDs={smIDs} />
                    {Models}
                </div>
            );
        };
        let Inactive              = () => <div className={"model--container collapsed"}>Models</div>;
        let matchActivationTarget = target => {
            return (
                target.classList.contains("dev--models") ||
                target.classList.contains("dev--model--wrapper") ||
                target.classList.contains("model--container--title") ||
                target.classList.contains("model--container")
            );
        };
        return <SelectivelyActive trigger={"click"}
        
                                  matchTarget={matchActivationTarget}
        
                                  className={"dev--models"}
        
                                  inactiveComponent={Inactive}
                                  activeComponent={Active}
        
                                  isActive={true} />;
    }
}

function mapState(state) {
    let modelState         = selectModelDevInterface(state);
    const models           = selectActiveDevModels(state) || {};
    const activeModelSmIDs = selectActiveModelSmIDs(state) || [];
    const allModelSmIDs    = modelState.list || [];
    return {models, allModelSmIDs, activeModelSmIDs};
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