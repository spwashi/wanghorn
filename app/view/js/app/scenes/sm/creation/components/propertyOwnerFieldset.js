import React from "react"
import * as PropTypes from "prop-types"


export class PropertyOwnerFieldset extends React.Component {
    render() {
        return <PropertyFieldset prefix={this.props.prefix}
                                 smEntity={this.props.smEntity}
                                 schematic={this.props.schematic}
        
                                 resolveSmEntitySchematic={this.props.resolveSmEntitySchematic}
                                 fetchSmEntities={this.props.fetchSmEntities || function () { return Promise.reject("Could not fetch smEntity"); }}
        
                                 getPropertyValue={this.props.getPropertyValue}
                                 getPropertyMessage={this.props.getPropertyMessage}
        
                                 updateValueStatus={this.props.updateValueStatus} />;
        
    }
}