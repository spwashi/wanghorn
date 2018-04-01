import React, {Component} from "react";
import axios from "axios"
//
import {MODELS} from "../../paths";
import {Query} from "./query";
import {SelectivelyActive} from "../../components";
import {ModelAsJSON} from "./modelAsJSON";

class ModelScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            models: []
        };
    }
    
    componentDidMount() {
        axios.get(MODELS)
             .then(response => {
                 let data: {
                     createTableStatements: [],
                     alterTableStatements: [],
                     models: {},
                     modelConfig: {},
                 }                         = response.data;
                 let createTableStatements =
                         Object.entries(data && data.createTableStatements || [])
                               .map(queryEntry => {
                                   const [key, createTableStatement] = queryEntry;
                                   let model                         = data.models && data.models[key];
                                   let modelConfig                   = data.modelConfig && data.modelConfig[key];
                                   let alterTableStatements          = (data.alterTableStatements && data.alterTableStatements[key]) || [];
                                   return (
                                       <div key={key} className={"dev--model"}>
                                           <h3 className={"title model--smID"}>{key}</h3>
                            
                                           <ModelAsJSON type="config" model={modelConfig} />
                                           <ModelAsJSON model={model} />
                                           <Query query={createTableStatement} />
                            
                                           {alterTableStatements.map((statement, key) => <Query key={key} type="AlterTable" query={statement} />)}
                        
                                       </div>
                                   );
                               });
            
                 this.setState({models: (createTableStatements)})
             });
    }
    
    render() {
        let Active                = () =>
            <div className={"model--container"}>
                <h3 className={"model--container--title"}>Models</h3>
                
                {this.state.models}
            </div>;
        let Inactive              = () => <div className={"model--container collapsed"}>Models</div>;
        let matchActivationTarget = target => {
            return (
                target.classList.contains("dev--models") ||
                target.classList.contains("dev--model") ||
                target.classList.contains("model--container--title") ||
                target.classList.contains("model--container"))
        };
        return <SelectivelyActive trigger={"click"}
        
                                  matchTarget={matchActivationTarget}
        
                                  className={"dev--models"}
        
        
                                  inactiveComponent={Inactive}
                                  activeComponent={Active}
        
                                  isActive={true} />;
    }
}

export default ModelScene;