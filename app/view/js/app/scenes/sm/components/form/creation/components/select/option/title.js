import React from "react"
import * as PropTypes from "prop-types"

/**
 * The Title of the SmEntity
 */
export class SmEntityTitle extends React.Component {
    static propTypes = {title: PropTypes.string};
    
    render() {
        return !!this.props.title ? this.props.title : null
    }
}