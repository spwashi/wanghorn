import React, {Component} from "react";
import axios from "axios"
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/styles/hljs';
//
import {MODELS} from "../../paths";

class SelectivelyActiveComponent extends Component {
    _activeComponent;
    _inactiveComponent;
    
    constructor(props: { isActive: boolean | undefined, trigger: "click" }) {
        super(props);
        this._activeComponent   = props.activeComponent;
        this._inactiveComponent = props.inactiveComponent || (() => <div />);
        this.state              = {
            isActive: props.isActive,
            trigger:  props.trigger
        }
    }
    
    handleClick(event) {
        console.log(this.props.trigger);
        
        if (this.props.trigger === "click") {
            this.setState({isActive: !this.state.isActive});
        }
    }
    
    render() {
        let className      = `${(this.props.className || '')} ${(this.state.isActive ? 'active' : '')}`;
        let InnerComponent = ({active}) => {
            let InactiveComponent = this._inactiveComponent;
            let ActiveComponent   = this._activeComponent;
            return active ? <ActiveComponent /> : <InactiveComponent />;
        };
        return (
            <div className={className} onClick={this.handleClick.bind(this)}>
                <InnerComponent active={this.state.isActive} />
            </div>
        );
    }
}

let CreateTableStatement = ({query}) => {
    let className                    = "query--createTableStatement";
    let InactiveCreateTableStatement = () =>
        <div className={className}>
            [ CreateTable MySQL ]
        </div>;
    let ActiveCreateTableStatement   = () =>
        <pre className={className}>
           <SyntaxHighlighter language='MySQL' style={docco}>{query}</SyntaxHighlighter>
        </pre>;
    return (
        <SelectivelyActiveComponent trigger={"click"}
                                    className={`wrapper ${className}--wrapper`}
        
                                    inactiveComponent={InactiveCreateTableStatement}
                                    activeComponent={ActiveCreateTableStatement}
        
                                    isActive={false} />
    );
};

let ModelAsJSON = function ({model}) {
    let className                       = "__json";
    const InactiveModelAsJSON_Component = () =>
        <div className={className}>
            [ as JSON ]
        </div>;
    const ActiveModelAsJSON_Component   = () =>
        <pre className={className}>
           {model && JSON.stringify(model, ' ', 3)}
        </pre>;
    return <SelectivelyActiveComponent trigger={"click"}
                                       className={`wrapper ${className}--wrapper`}
                                       inactiveComponent={InactiveModelAsJSON_Component}
                                       activeComponent={ActiveModelAsJSON_Component}
                                       isActive={false} />;
};

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
                                   return (
                                       <div key={key} className={"dev--model"}>
                                           <h3 className={"title model--smID"}>{key}</h3>
                                           <CreateTableStatement query={query} />
                                           <ModelAsJSON model={model} />
                                       </div>
                                   );
                               });
            
                 this.setState({models: (formattedQueries)})
             });
    }
    
    render() {
        return <div className="dev--models">{this.state.models}</div>;
    }
}

export default ModelScene;