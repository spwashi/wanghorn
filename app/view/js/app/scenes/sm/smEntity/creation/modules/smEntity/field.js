import React from "react"
import * as PropTypes from "prop-types"
import PropertyField from "../../../form/property/index";

/**
 * Converts an SmEntitySchematic to a field (usually properties)
 */
export class SchematicField extends React.Component {
    static propTypes = {
        name:      PropTypes.string,
        prefix:    PropTypes.string,
        value:     PropTypes.any,
        message:   PropTypes.any,
        schematic: PropTypes.object,
        
        resolveSmEntitySchematic: PropTypes.func,
        resolveSmEntities:        PropTypes.func,
        
        updateValueStatus: PropTypes.func
    };
    
    render() {
        return <PropertyField name={this.props.name}
                              prefix={this.props.prefix}
                              value={this.props.value}
                              message={this.props.message}
                              schematic={this.props.schematic}
        
                              resolveSmEntitySchematic={this.props.resolveSmEntitySchematic}
                              resolveSmEntities={this.props.resolveSmEntities || function () { return Promise.reject("Could not fetch smEntity"); }}
        
                              updateValueStatus={this.props.updateValueStatus} />;
    }
}