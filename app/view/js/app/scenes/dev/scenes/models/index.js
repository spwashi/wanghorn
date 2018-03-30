import React, {Component} from "react";
import axios from "axios"
import {MODELS} from "../../paths";

class ModelScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createTableStatements: []
        };
    }
    
    componentDidMount() {
        axios.get(MODELS)
             .then(response => {
                 let data: { formattedQueries: [], models: {} } = response.data;
                 let status                                     = response.status;
                 let statusText                                 = response.statusText;
                 let headers                                    = response.headers;
                 let config                                     = response.config;
                 console.log(data);
                 console.log(status);
                 console.log(statusText);
                 console.log(headers);
                 console.log(config);
                 let formattedQueries =
                         ((data && data.formattedQueries) || []).map(query => () => {
                             return <pre className={"query--createTableStatement"}>{query}</pre>;
                         });
            
                 this.setState({createTableStatements: (formattedQueries) || []})
             });
    }
    
    render() {
        const Scene =
                  <div className={"dev--models"}>
                      <pre className="dev--models--createTableStatements">{this.state.createTableStatements.map()}</pre>
                  </div>;
        
        return Scene;
    }
}

export default ModelScene;