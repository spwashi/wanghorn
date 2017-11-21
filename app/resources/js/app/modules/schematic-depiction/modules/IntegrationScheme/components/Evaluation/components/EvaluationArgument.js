import React, {Component} from "react";
import {AnchorPlaceholder} from "../../../../../components/Anchor/index";

class EvaluationArgument extends Component {
    constructor(props) {
        super(props);
        this.ampersand = this.getAnchorPlaceholder();
        this.state     = {
            argument: props.argument,
        };
    }
    
    render() {
        const essential = this.props.type;
        let className   = `evaluation--argument argument-${essential} schema--attribute-integration-scheme--evaluation--argument-${essential}`;
        
        return (
            <div className={className}>
                {this.state.argument || this.ampersand}
            </div>
        );
    }
    
    getAnchorPlaceholder() {
        return <AnchorPlaceholder owner={this} />
    }
}

export default EvaluationArgument;