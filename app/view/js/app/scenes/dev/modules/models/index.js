import React, {Component} from "react";
import {connect} from "react-redux";
//
import {SelectivelyActive} from "../../components";
import Model from "./model";
import {fetchModels} from "./actions";
import {selectDevModels} from "./selector";

@connect(state => {
    let modelState   = selectDevModels(state);
    const models     = modelState.models;
    const modelSmIDs = modelState.list;
    return {models, modelSmIDs};
})
export default class ModelScene extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this.props.dispatch(fetchModels());
    }
    
    /**
     * Given the response from the /dev/models API call, format each individual Model
     * @param data
     * @return {Array<Model>}
     */
    static createModels(data) {
        return Object.entries(data)
                     .map(queryEntry => {
                         const [key, modelData]   = queryEntry;
                         let alterTableStatement  = modelData.alterTableStatements;
                         let createTableStatement = modelData.createTableStatement;
                         let model                = modelData.model;
                         let modelConfig          = modelData.config;
                         return <Model key={key}
                                       smID={key}
            
                                       config={modelConfig}
                                       model={model}
            
                                       createTableStatement={createTableStatement}
                                       alterTableStatement={alterTableStatement || []} />
                     });
    }
    
    render() {
        let Active                = () => {
            const models = this.props.models;
            if (!models) return 'loading';
            const Models = ModelScene.createModels(models);
            
            return (
                <div className={"model--container"}>
                    <h2 className={"model--container--title"}>Models</h2>
                    <ul className={"model--container--link--container"}>
                        {
                            Object.values(Models)
                                  .map(model => {
                                      let smID = model.props.smID;
                                      return <li key={smID} className={"model--container--link model--smID--link"}><a href={`#${smID}`}>{smID}</a></li>
                                  })
                        }
                    </ul>
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