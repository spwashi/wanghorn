import React from "react"
import * as PropTypes from "prop-types"

export class InactiveModelScene extends React.Component {
    static propTypes = {
        activeElRef: PropTypes.func
    };
    
    render() {
        return (
            <div ref={this.props.activeElRef} className={"model--container collapsed"}>
                <h2 className="title model--container--title">Models</h2>
            </div>
        )
    }
}