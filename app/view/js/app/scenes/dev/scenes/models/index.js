import React, {Component} from "react";
import axios from "axios"
//
import {MODELS} from "../../paths";
import {CreateTableStatement} from "./createTableStatement";
import {SelectivelyActiveComponent} from "./selectivelyActive";
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
                 let data: { formattedQueries: [], models: {} } = response.data;
                 let formattedQueries                           =
                         Object.entries(data && data.formattedQueries || [])
                               .map(queryEntry => {
                                   const [key, query] = queryEntry;
                                   let model          = data.models && data.models[key];
                                   let modelConfig    = data.modelConfig && data.modelConfig[key];
                                   return (
                                       <div key={key} className={"dev--model"}>
                                           <h3 className={"title model--smID"}>{key}</h3>
                            
                                           <ModelAsJSON type="config" model={modelConfig} />
                                           <ModelAsJSON model={model} />
                                           <CreateTableStatement query={query} />
                        
                                       </div>
                                   );
                               });
            
                 this.setState({models: (formattedQueries)})
             });
    }
    
    render() {
        let Active                = () => <div className={"model--container"}>{this.state.models}</div>;
        let Inactive              = () => <div className={"model--container collapsed"}>Models</div>;
        let matchActivationTarget = target => {
            console.log(target);
            return (
                target.classList.contains("dev--models") ||
                target.classList.contains("dev--model") ||
                target.classList.contains("model--container"))
        };
        return <SelectivelyActiveComponent trigger={"click"}
        
                                           matchTarget={matchActivationTarget}
        
                                           className={"dev--models"}
        
        
                                           inactiveComponent={Inactive}
                                           activeComponent={Active}
        
                                           isActive={true} />;
    }
}

export default ModelScene;