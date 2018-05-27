import React from "react"
import * as PropTypes from "prop-types"
import PropertyField from "../../form/propertyField";

export class PropertySchematicAsField extends React.Component {
    static propTypes = {value: PropTypes.any};
    
    render() {
        return <PropertyField name={this.props.prefix}
                              value={this.props.value}
                              schematic={this.props.schematic}
        
                              resolveSmEntitySchematic={this.props.resolveSmEntitySchematic}
                              resolveSmEntities={this.props.resolveSmEntities || function () { return Promise.reject("Could not fetch smEntity"); }}
        
                              getPropertyValue={this.props.getPropertyValue}
                              getPropertyMessage={this.props.getPropertyMessage}
        
                              updateValueStatus={this.props.updateValueStatus} />;
    }
}