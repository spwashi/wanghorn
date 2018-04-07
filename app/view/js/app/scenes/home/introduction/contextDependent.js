import React from "react"
import * as PropTypes from "prop-types"

class ContextDependent {
    render() {
        const {activation} = this.props;
    }
}

ContextDependent.propTypes = {
    activation: PropTypes.func.isRequired
};